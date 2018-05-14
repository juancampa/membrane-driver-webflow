const { root } = program.refs;
import { webflow } from './client';

export async function init() {
  await root.set({
    sites: {},
  });
}

export const SiteCollection = {
  // UI not resolve
  async one({ args }) {
    return webflow.sites({ siteId: args.id });
  },

  async items() {
    return webflow.sites();
  },
};

export const Site = {
  async self({ source }) {
    return root.sites.one({ id: source._id });
  },
  id({ source }) {
    return source['_id'];
  },
  domains() {
    return {};
  },
  collections() {
    return {};
  },
};

export const DomainCollection = {
  async one({ args, self }) {
    const { id: siteId } = self.match(root.sites.one());
    const domains = await webflow.domains({ siteId: siteId });
    return domains.find(d => d.id === args.id);
  },

  async items({ source, self }) {
    const { id: siteId } = self.match(root.sites.one());
    return webflow.domains({ siteId: siteId });
  },
};

export const Domain = {
  async self() {
    // return root.sites.one({siteId: }).domains().one({ id: })
  },
  id({ source }) {
    return source['_id'];
  },
};

export const CollectionCollection = {
  async one({ args }) {
    return webflow.collection({ collectionId: args.id });
  },
  async items({ source, self }) {
    const { id: siteId } = self.match(root.sites.one());
    return webflow.collections({ siteId: siteId });
  },
};

export const Collection = {
  async self() {
    // return root.sites.one({siteId: }).domains().one({ id: })
  },
  id({ source }) {
    return source['_id'];
  },
  fields({ source }) {
    return JSON.stringify(source.fields);
  },
  items() {
    return {};
  },
};

export const ItemCollection = {
  async one({ args }) {
    const { id: collectionId } = self.match(root.sites.one().collections.one());
    return webflow.item({ collectionId: collectionId, itemId: args.id });
  },
  async page({ source, args }) {
    return webflow.items({ collectionId: source._id }, ...args);
  },
};

export const ItemsPage = {
  async items({ source }) {
    return source.items;
  },
  async next({ self, source }) {
    if (source.offset === undefined) {
      return null;
    }
    const { id: siteId } = self.match(root.sites.one());

    const { id: collectionId } = self.match(root.sites.one().collections.one());

    // prettier format ?
    const args = self.match(
      root.sites
        .one()
        .collections()
        .one()
        .itemsPage()
    );

    // prettier format ?
    return root.sites
      .one((id: siteId))
      .collections()
      .one((id: collectionId))
      .itemsPage({ ...args, offset: source.offset });
  },
};

export const Item = {
  async self() {
    // TODO
    //return
  },
  id({ source }) {
    return source['_id'];
  },
  archived({ source }) {
    return source['_archived'];
  },
  draft({ source }) {
    return source['_draft'];
  },
  postBody({ source }) {
    return source['post-body'];
  },
  postSummary({ source }) {
    return source['post-summary'];
  },
  updatedOn({ source }) {
    return source['updated-on'];
  },
  updatedBy({ source }) {
    return source['updated-by'];
  },
  createdOn({ source }) {
    return source['created-on'];
  },
  createdBy({ source }) {
    return source['created-by'];
  },
  publishedOn({ source }) {
    return source['published-on'];
  },
  publishedBy({ source }) {
    return source['published-by'];
  },
  cid({ source }) {
    return source['_cid'];
  },
  thumbnailImage({ source }) {
    return source['thumbnail-image'];
  },
  mainImage({ source }) {
    return source['main-image'];
  },
};
