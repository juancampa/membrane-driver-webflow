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
  async self({ self, source, parent }) {
    const { _id } = source;
    if (_id === undefined || _id === null) {
      return null;
    }
    return self || parent.ref.pop().push('one', { id: _id });
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
  async self({ source, self, parent }) {
    const { _id } = source;
    if (_id === undefined || _id === null) {
      return null;
    }
    return self || parent.ref.pop().push('one', { id: _id });
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
  async one({ self, args }) {
    const { id: collectionId } = self.match(root.sites.one().collections.one());

    return webflow.item({ collectionId: collectionId, itemId: args.id });
  },
  async page({ self, args }) {
    const { id } = self.match(root.sites.one().collections().one());

    return webflow.items({ collectionId: id }, args);
  },
};

export const ItemPage = {
  async items({ source }) {
    return source.items;
  },
  async next({ self, source }) {
    if (source.offset === undefined) {
      return null;
    }
    const { id: siteId } = self.match(root.sites.one());

    const { id: collectionId } = self.match(root.sites.one().collections().one());

    const args = self.match(root.sites.one().collections().one().items().page());
    return root.sites.one({ id: siteId }).collections().one({ id: collectionId }).items().page({ ...args, offset: source.offset });
  },
};

export const Item = {
  async self({ source, self, parent }) {
    const { _id } = source;
    if (_id === undefined || _id === null) {
      return null;
    }
    return self || parent.ref.pop().pop().push('one', { id: _id });
  },
  id({ source }) {
    return source['_id'];
  },
  fields({ source }) {
    return JSON.stringify(source);
  },
};
