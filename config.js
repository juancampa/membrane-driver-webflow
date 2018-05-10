const { schema, imports, dependencies, environment, expressions, endpoints } = program;

environment
  .add('API_TOKEN', 'The Api Token')

schema.type('Root')
  .field('sites', 'SiteCollection')

schema.type('SiteCollection')
  .computed('one', 'Site')
    .param('id', 'String')
  .computed('items', '[Site]')

schema.type('Site')
  .computed('self', 'Site*')
  .field('_id', 'String', 'Unique identifier for site')
  .field('createdOn', 'String', 'Date the site was created')
  .field('name', 'String', 'Name given to site')
  .field('shortName', 'String', 'Slugified version of name')
  .field('lastPublished', 'String', 'Date site was last published')
  .field('previewUrl', 'String', 'URL of a generated image for the given site')
  .field('timezone', 'String', 'Site timezone set under Site Settings')
  .field('database', 'String')
  .computed('domains', 'DomainCollection', 'List of all custom domains added to the given site')
//  .computed('collections', 'CollectionCollection')

schema.type('DomainCollection')
  .computed('one', 'Domain')
    .param('id', 'String')
  .computed('items', '[Domain]')

schema.type('Domain')
  .computed('self', 'Domain*')
  .field('_id', 'String', 'Unique identifier for site')
  .field('name', 'String', 'The domain name')
