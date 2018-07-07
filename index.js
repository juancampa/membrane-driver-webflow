const { root } = program.refs;
import { webflow } from './client';

export async function init() {
  await root.set({
    sites: {},
  });
}

export async function test({ name }) {
  switch (name) {
    case 'access': {
      try {
        const res = await webflow.info();
        if (res._id) {
          return true;
        }
      } catch (e) {
        return false;
      }
      break;
    }
    case 'webhooks': {
      // TODO
      return false;
    }
  }
  return false;
}

export async function endpoint({ name, req }) {
  switch (name) {
    case 'webhooks': {
      const siteId = req.body.site || null;
      const event = {
        name: req.body.name,
        data: JSON.stringify(req.body.data),
        site: siteId && root.sites.one({ id: siteId }),
      }

      siteId && await event.sites.formReceived.dispatch(event);
      break;
    }
  }
}

export const SiteCollection = {
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
  async createCollectionItem({ args, self }) {
    const { id } = self.match(root.sites.one().collections().one());
    const fields = JSON.parse(args.fields)
    return webflow.createItem({ collectionId: id, fields: fields });
  },
  async createLiveCollectionItem({ args, self }) {
    const { id } = self.match(root.sites.one().collections().one());
    const fields = JSON.parse(args.fields)
    return webflow.createItem({ collectionId: id, fields: fields }, { live: true });
  },
  async updateCollectionItem({ args, self }) {
    const { id } = self.match(root.sites.one().collections().one());
    const fields = JSON.parse(args.fields)
    return webflow.updateItem({ collectionId: id, itemId: args.id,  fields: fields });
  },
  async updateLiveCollectionItem({ args, self }) {
    const { id } = self.match(root.sites.one().collections().one());
    const fields = JSON.parse(args.fields)
    return webflow.updateItem({ collectionId: id, itemId: args.id, fields: fields }, { live: true });
  },
  async removeCollectionItem({ args, self }) {
    const { id } = self.match(root.sites.one().collections().one());
    return webflow.removeItem({ collectionId: id, itemId: args.id })
 },
};

function getNextPageRef(pageRef, response, args) {
  const {offset, count, total} = response

  if (total > offset +  count) {
    return pageRef.ref.withArgs({ ...args , offset: offset +  count  });
  }

  return null
};

export const ItemCollection = {
  async one({ self, args }) {
    const { id: collectionId } = self.match(root.sites.one().collections().one());

    return webflow.item({ collectionId: collectionId, itemId: args.id });
  },
  async page({ self, args }) {
    const { id } = self.match(root.sites.one().collections().one());

    const result = await webflow.items({ collectionId: id }, args);
    return {
      items: result.items,
      next: getNextPageRef(self.page(args), result, args),
    };
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

export const WebhookCollection = {
  async one({ args }) {
    const { id } = self.match(root.sites.one());

    return webflow.webhook({ siteId: id , webhookId: args.id });
  },

  async items() {
    const { id } = self.match(root.sites.one());

    return webflow.webhooks({ siteId: id });
  },
  async createWebhook({ args, self }) {
    const { id } = self.match(root.sites.one());
    const { triggerType, url , filter} = args;
    return webflow.createWebhook({
      siteId: id,
      triggerType: triggerType,
      url: url,
      filter: filter,
    });
  },
  async removeWebhook({ args, self }) {
    const { id } = self.match(root.sites.one());
    return webflow.removeWebhook({ siteId: id, webhookId: args.id })
  },
};

export const Webhook = {
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
  filter({ source }) {
    return JSON.stringify(source.filter);
  },
};
