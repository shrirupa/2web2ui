/* eslint-disable max-lines */
import React, { useState } from 'react';
import {
  Button,
  Panel,
  Modal,
  TextField,
  ComboBoxTextField
} from '@sparkpost/matchbox';
import Loading from 'src/components/loading';
import { isEmailAddress } from 'src/helpers/email';
import useEditorContext from '../hooks/useEditorContext';
import styles from './SendTestEmailButton.module.scss';

const SendTestEmailButton = () => {
  const {
    content,
    isPublishedMode,
    match,
    sendPreview,
    showAlert,
    subaccountId,
    updateDraft
  } = useEditorContext();
  const templateId = match.params.id;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalLoading, setModalLoading] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [toEmailList, setToEmailList] = useState([]);
  const [hasToEmailError, setToEmailError] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');

  const clearForm = () => {
    setToEmail('');
    setToEmailList([]);
  };

  const handleToChange = (e) => {
    setToEmail(e.target.value);
    setToEmailError(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    setModalLoading(true);

    // Save the template, then allow the user to send a preview
    // The preview can be send whether the current draft was successfully saved or not.
    updateDraft({ id: templateId, content }, subaccountId)
      .finally(() => {
        setModalLoading(false);
        setFromEmail(content.from.email);
        setSubject(content.subject);
      });
  };

  const handleModalClose = () => {
    clearForm();
    setModalOpen(false);
    setToEmailError(false);
  };

  const handleToKeyDownAndBlur = (e) => {
    // prevent form submission when using the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
    }

    // Remove the last email from the list when the user deletes
    // and no in progress value is present in the field
    if (e.keyCode === 8 && !toEmail) {
      setToEmailList(toEmailList.filter((email, index) => {
        if (index + 1 !== toEmailList.length) {
          return email;
        }
      }));
    }

    if (e.type === 'blur' || e.keyCode === 32) {
      if (e.type === 'keydown') {
        e.preventDefault(); // Prevents spaces from being written to the field
      }

      const isValidEmail = isEmailAddress(toEmail);

      // A valid email address is entered, and it is added to the array
      if (isValidEmail) {
        setToEmailList([...toEmailList, { email: toEmail }]);
        setToEmail('');
        setToEmailError(false);
      }

      // Throw an error on the field if:
      // 1. There is some text entry in the field
      // 2. The entered email is not valid or
      // 3. The entered email already exists in the list
      if (toEmail && !isValidEmail) {
        setToEmailError(true);
      }
    }
  };

  const handleRemoveItem = (target) => {
    setToEmailList(toEmailList.filter((item) => {
      if (target !== item) {
        return item;
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (toEmailList.length === 0) {
      setToEmailError(true);
    } else {
      setModalLoading(true);
    }

    if (toEmailList.length && templateId) {
      sendPreview({
        id: templateId,
        subaccountId: subaccountId,
        mode: isPublishedMode ? 'published' : 'draft',
        emails: toEmailList.map((item) => item.email),
        from: fromEmail
      })
        .then(() => {
          setModalLoading(false); // Seems repetitive, but prevents janky loading state from continuing even after success
          setModalOpen(false);
          clearForm();

          showAlert({
            type: 'success',
            message: 'Successfully sent a test email'
          });
        })
        .finally(() => setModalLoading(false));
    }
  };

  return (
    <>
      <Button
        flat
        color="blue"
        size="small"
        title="Opens a dialog"
        onClick={handleModalOpen}
      >
        Send a Test
      </Button>

      <Modal
        open={isModalOpen}
        showCloseButton={true}
        onClose={handleModalClose}
      >
        <Panel
          accent
          title="Send a Test"
          sectioned
        >
          {isModalLoading &&
            <div className={styles.LoadingWrapper}>
              <Loading className={styles.Loading}/>
            </div>
          }

          {!isModalLoading &&
            <>
              <p>Verify your email renders as expected in the inbox by sending a quick test.</p>

              <form onSubmit={(e) => handleSubmit(e)}>
                <ComboBoxTextField
                  id="text-field-test-email-to"
                  label="To:"
                  name="emailTo"
                  value={toEmail}
                  selectedItems={toEmailList}
                  itemToString={({ email }) => email}
                  onChange={handleToChange}
                  onKeyDown={handleToKeyDownAndBlur}
                  onBlur={handleToKeyDownAndBlur}
                  removeItem={handleRemoveItem}
                  error={hasToEmailError ? 'Please enter a valid email address' : ''}
                />

                <TextField
                  id="text-field-test-email-from"
                  label="From:"
                  name="emailFrom"
                  type="email"
                  disabled
                  value={fromEmail}
                />

                <TextField
                  id="text-field-test-email-subject"
                  label="Subject:"
                  name="emailSubject"
                  type="email"
                  disabled
                  value={subject}
                />

                <Button
                  color="orange"
                  type="submit"
                >
                  Send Email
                </Button>
              </form>
            </>
          }
        </Panel>
      </Modal>
    </>
  );
};

export default SendTestEmailButton;
