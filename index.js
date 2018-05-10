const { root } = program.refs;
import { webflow } from './client';

export async function init() {
  await root.set({
    sites: {},
  });
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
    return root.sites.one({ id: source.id });
  },
  domains() {
    return {};
  },
};

export const DomainCollection = {
  async one({ args, self }) {
    const { _id: siteId } = self.match(root.sites.one());
    const domains = await webflow.domains({ siteId: siteId });
    return domains.find(d => d.id === args.id);
  },

  async items({ source }) {
    const { _id: siteId } = self.match(root.sites.one());
    return webflow.domains({ siteId: siteId });
  },
};

export const Domain = {
  async self() {
    // TODO
  },
};
