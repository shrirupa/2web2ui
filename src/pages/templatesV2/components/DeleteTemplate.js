import React, { useState } from 'react';
import { Button } from '@sparkpost/matchbox';
import useEditorContext from '../hooks/useEditorContext';
import { DeleteModal } from 'src/components';

const DeleteTemplate = ({ children, afterDelete, ...rest }) => {
  const {
    deleteTemplateV2,
    isDeletePending,
    subaccountId,
    draft
  } = useEditorContext();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteTemplateV2({ id: draft.id, subaccountId })
      .then(() => {
        if (afterDelete) {
          afterDelete;
        }
      });
  };

  return (
    <>
      <DeleteModal
        open={open}
        title="Are you sure you want to delete this template?"
        content={<p>Both the draft and published versions of this template will be deleted.</p>}
        onCancel={() => setOpen(false)}
        onDelete={handleDelete}
        isPending={isDeletePending}
      />
      <Button {...rest} onClick={() => setOpen(true)}>
        {children}
      </Button>
    </>
  );
};


export default DeleteTemplate;
