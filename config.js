const { schema, imports, dependencies, environment, expressions, endpoints } = program;

environment
  .add('API_TOKEN', 'The Api Token')

schema.type('Root')
  .field('sites', 'SiteCollection')

schema.type('SiteCollection')
  .computed('one', 'Site', 'A Webflow site')
    .param('id', 'String')
  .computed('items', '[Site]', 'List of all sites the provided access token is able to access.')

schema.type('Site')
  .computed('self', 'Site*')
  .computed('id', 'String', 'Unique identifier for site')
  .field('createdOn', 'String', 'Date the site was created')
  .field('name', 'String', 'Name given to site')
  .field('shortName', 'String', 'Slugified version of name')
  .field('lastPublished', 'String', 'Date site was last published')
  .field('previewUrl', 'String', 'URL of a generated image for the given site')
  .field('timezone', 'String', 'Site timezone set under Site Settings')
  .field('database', 'String')
  .computed('domains', 'DomainCollection', 'List of all custom domains added to the given site')
  .computed('collections', 'CollectionCollection','Groupings of Items and define the schema or structure of the custom data stored in those Items')

schema.type('DomainCollection')
  .computed('one', 'Domain', 'A custom domain')
    .param('id', 'String')
  .computed('items', '[Domain]', 'All custom domains')

schema.type('Domain')
  .computed('self', 'Domain*')
  .computed('id', 'String', 'Unique identifier for site')
  .field('name', 'String', 'The domain name')

schema.type('CollectionCollection')
  .computed('one', 'Collection')
    .param('id', 'String')
  .computed('items', '[Collection]')

schema.type('Collection')
  .computed('self', 'Collection*')
  .computed('id', 'String', 'The unique identifier for the Collection')
  .field('lastUpdated', 'String', 'Collection was last updated')
  .field('createdOn', 'String', 'Collection was created')
  .field('name', 'String', 'Name given to Collection')
  .field('slug', 'String', 'Slug of Collection in Site URL structure')
  .field('singularName', 'String', 'The name of one Item in Collection')
  .computed('fields', 'String', 'See full Fields section')
  .computed('items', 'ItemCollection')

schema.type('ItemCollection')
  .computed('one', 'Item')
    .param('id', 'String')
  .computed('page', 'ItemPage')
      .param('offset','Int')
      .param('limit','Int')

schema.type('ItemPage')
  .field('items', '[Item]')
  .field('next', 'ItemPage*')

schema.type('Item')
  .computed('self', 'Item*')
  .computed('id', 'String', 'Unique identifier for the Item')
  .computed('fields', 'String', 'All data of the item')
