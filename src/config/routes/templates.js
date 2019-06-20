import { templates, templatesV2 } from 'src/pages';
import { hasGrants } from '../../helpers/conditions';
import App from '../../components/layout/App';
import Fullscreen from 'src/components/layout/Fullscreen';

const v1Routes = [
  {
    path: '/templates',
    component: templates.ListPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Templates',
    supportDocSearch: 'template'
  },
  {
    path: '/templates/create/:id?',
    component: templates.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App,
    title: 'New Template',
    supportDocSearch: 'template'
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Edit Template',
    supportDocSearch: 'template'
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'View Published Template',
    supportDocSearch: 'template'
  },
  {
    path: '/templates/preview/:id',
    component: templates.PreviewDraftPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Preview Draft Template',
    supportDocSearch: 'template'
  },
  {
    path: '/templates/preview/:id/published',
    component: templates.PreviewPublishedPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Preview Published Template',
    supportDocSearch: 'template'
  }
];

const v2Routes = [
  {
    path: '/templatesv2',
    component: templatesV2.ListPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Templates',
    supportDocSearch: 'template'
  },
  {
    path: '/templatesv2/create',
    component: templatesV2.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App,
    title: 'Create New Template',
    supportDocSearch: 'template'
  },
  {
    path: '/templatesv2/edit/:id/:version?/:navKey?',
    component: templatesV2.EditAndPreviewPage,
    condition: hasGrants('templates/view'),
    layout: Fullscreen,
    title: 'Edit Template',
    supportDocSearch: 'template'
  }
];

const allTemplateRoutes = v1Routes.concat(v2Routes);

export default allTemplateRoutes;
