import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { LINKS } from 'src/constants';
import { TextFieldWrapper } from 'src/components';
import { PageLink } from 'src/components/links';
import { Grid, Button, Panel, Stack } from 'src/components/matchbox';
import { ExternalLink } from 'src/components/links';
import {
  TemplateTypeaheadWrapper,
  SubaccountTypeaheadWrapper,
} from 'src/components/reduxFormWrappers';
import { slugify } from 'src/helpers/string';
import { hasSubaccounts as hasSubaccountsSelector } from 'src/selectors/subaccounts';
import { selectPublishedTemplatesBySubaccount } from 'src/selectors/templates';
import { required, maxLength, slug, abTestDefaultTemplate } from 'src/helpers/validation';
const formName = 'abTestCreateForm';

export class AbTestCreateFormHibana extends Component {
  handleIdFill = e => {
    this.props.change('id', slugify(e.target.value));
  };
  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      hasSubaccounts,
      templates,
      subaccountId,
    } = this.props;

    const disabled = pristine || submitting;
    const submitText = submitting ? 'Submitting...' : 'Continue';
    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Stack>
            <Grid>
              <Grid.Column>
                <Field
                  name="name"
                  component={TextFieldWrapper}
                  label="A/B test name"
                  onChange={this.handleIdFill}
                  validate={[required, maxLength(64)]}
                  helpText={
                    <ExternalLink to={LINKS.AB_TESTING_API}>
                      Learn more about A/B tests
                    </ExternalLink>
                  }
                />
              </Grid.Column>
              <Grid.Column>
                <Field
                  name="id"
                  component={TextFieldWrapper}
                  label="A/B Test ID"
                  helpText={"A Unique ID for your test, we'll fill this in for you."}
                  validate={[required, slug, maxLength(64)]}
                />
              </Grid.Column>
            </Grid>

            {hasSubaccounts ? (
              <Grid>
                <Grid.Column md={6}>
                  <Field
                    name="subaccount"
                    component={SubaccountTypeaheadWrapper}
                    label="Subaccount Assignment"
                    placeholder="Master Account"
                    helpText="Leaving this field blank will permanently assign the A/B test to the master account."
                  />
                </Grid.Column>
              </Grid>
            ) : null}
            <Grid>
              <Grid.Column md={6}>
                <Field
                  name="default_variant"
                  component={TemplateTypeaheadWrapper}
                  subaccountId={subaccountId}
                  label={'Default template'}
                  placeholder="Type to search"
                  helpText={
                    templates.length > 0 ? (
                      <span>
                        Only published templates are available. Or{' '}
                        <PageLink to="/templates">create a new template</PageLink>.
                      </span>
                    ) : (
                      <span>
                        No published templates available.{' '}
                        <PageLink to="/templates">
                          Head over to the templates page to set some up
                        </PageLink>
                        .
                      </span>
                    )
                  }
                  errorInLabel
                  validate={[required, abTestDefaultTemplate]}
                />
              </Grid.Column>
            </Grid>
          </Stack>
        </Panel.Section>
        <Panel.Section>
          <Button submit variant="primary" disabled={disabled}>
            {submitText}
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const selector = formValueSelector(formName);
  const subaccountId = selector(state, 'subaccount.id');

  return {
    initialValues: {},
    hasSubaccounts: hasSubaccountsSelector(state),
    templates: selectPublishedTemplatesBySubaccount(state, subaccountId),
    subaccountId, // Subaccount ID is used to filter available templates in the typeahead
  };
}

const formOptions = {
  form: formName,
  enableReinitialize: true,
};

export default connect(mapStateToProps, {})(reduxForm(formOptions)(AbTestCreateFormHibana));
