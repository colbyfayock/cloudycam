export const DEFAULT_EVENT_ID = 'default';

export const events = {
  [DEFAULT_EVENT_ID]: {
    register: {
      link: 'https://cloudinary.com/users/register/free',
      text: 'Get Your Free Account',
    },
    utm: {
      source: 'cloudycam',
      medium: 'cloudycam',
      campaign: 'cloudycam',
    },
  },

  // Events

  canariasjs: {
    register: {
      link: 'https://forms.monday.com/forms/e5f543d53ee8de0441cf133d13df553b?r=use1',
      text: 'Get Your Free Account',
    },
    hashtags: ['JSDayCAN2022'],
    incentive: {
      text: 'extra 3 credits',
      moreInfo: {
        text: 'what are credits?',
        link: 'https://cloudinary.com/pricing/compare-plans',
      },
    },
    utm: {
      source: 'canariasjs',
      medium: 'event',
      campaign: '2022canariasjs_booth',
    },
  },

  cityjsbrazil: {
    register: {
      link: 'https://forms.monday.com/forms/e1ad68a7699011ccfd2514a8d47a3aa3',
      text: 'Get Your Free Account',
    },
    hashtags: ['CityJSBrazil'],
    incentive: {
      text: 'extra 3 credits',
      moreInfo: {
        text: 'what are credits?',
        link: 'https://cloudinary.com/pricing/compare-plans',
      },
    },
    utm: {
      source: 'cityjsbrazil',
      medium: 'event',
      campaign: 'cityjsbrazil_booth',
    },
  },

  vueconfus: {
    register: {
      link: 'https://forms.monday.com/forms/1a5c33d75181a0968c7b297f3f12bd3b',
      text: 'Get Your Free Account',
    },
    hashtags: ['vueconfus'],
    incentive: {
      text: 'extra 3 credits',
      moreInfo: {
        text: 'what are credits?',
        link: 'https://cloudinary.com/pricing/compare-plans',
      },
    },
    utm: {
      source: 'vueconfus',
      medium: 'event',
      campaign: 'vueconfus2022_booth',
    },
  },

  VueConfUS: {
    register: {
      link: 'https://forms.monday.com/forms/1a5c33d75181a0968c7b297f3f12bd3b',
      text: 'Get Your Free Account',
    },
    hashtags: ['vueconfus'],
    incentive: {
      text: 'extra 3 credits',
      moreInfo: {
        text: 'what are credits?',
        link: 'https://cloudinary.com/pricing/compare-plans',
      },
    },
    utm: {
      source: 'vueconfus',
      medium: 'event',
      campaign: 'vueconfus2022_booth',
    },
  },
};
