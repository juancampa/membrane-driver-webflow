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
  .computed('collections', 'CollectionCollection')

schema.type('DomainCollection')
  .computed('one', 'Domain')
    .param('id', 'String')
  .computed('items', '[Domain]')

schema.type('Domain')
  .computed('self', 'Domain*')
  .field('_id', 'String', 'Unique identifier for site')
  .field('name', 'String', 'The domain name')

schema.type('CollectionCollection')
  .computed('one', 'Collection')
    .param('id', 'String')
  .computed('items', '[Collection]')

schema.type('Collection')
  .computed('self', 'Collection*')
  .field('_id', 'String', 'The unique identifier for the Collection')
  .field('lastUpdated', 'String', 'Collection was last updated')
  .field('createdOn', 'String', 'Collection was created')
  .field('name', 'String', 'Name given to Collection')
  .field('slug', 'String', 'Slug of Collection in Site URL structure')
  .field('singularName', 'String', 'The name of one Item in Collection')
  .computed('fields', 'String', 'See full Fields section')
  .computed('itemsPage', 'ItemsPage')
      .param('offset','Int')
      .param('limit','Int')

schema.type('ItemsPage')
  .computed('items', 'ItemsCollections')
  .computed('next', 'ItemsPage*')

schema.type('ItemsCollection')
  .computed('one', 'Item')
    .param('id', 'String')
  .computed('items', '[Item]') // TODO items.items.items... ?

schema.type('Item')
  .computed('self', 'Item*')
  .field('_id', 'String')
  .field('_archived','String')
  .field('_draft','String')
  .field('color','String')
  .field('featured','String')
  .field('name','String')
  .field('post-body','String')
  .field('post-summary','String')
  .field('slug','String')
  .field('updated-on','String')
  .field('updated-by','String')
  .field('created-on','String')
  .field('created-by','String')
  .field('published-on','String')
  .field('published-by','String')
  .field('author','String')
  .field('_cid','String')
  .field('thumbnail-image','ImageSource')
  .field('main-image','ImageSource')

schema.type('ImageSource')
  .field('fileId', 'String')
  .field('url', 'String')

