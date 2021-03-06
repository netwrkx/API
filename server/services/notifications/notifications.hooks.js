const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, populate, unless } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const isAdmin = require('../../hooks/is-admin');

const restrict = [
  restrictToOwner()
];

const commentSchema = {
  include: {
    service: 'comments',
    nameAs: 'comment',
    parentField: 'relatedCommentId',
    childField: '_id',
    query: {
      $limit: 1
    },
    include: {
      service: 'users',
      nameAs: 'user',
      parentField: 'userId',
      childField: '_id',
      query: {
        $limit: 1,
        $select: ['_id', 'name', 'slug', 'avatar', 'lastActiveAt', 'termsAndConditionsAccepted', 'thumbnails']
      }
    }
  }
};

const contributionSchema = {
  include: {
    service: 'contributions',
    nameAs: 'contribution',
    parentField: 'relatedContributionId',
    childField: '_id',
    query: {
      $limit: 1
    }
  }
};

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'relatedUserId',
    childField: '_id',
    query: {
      $limit: 1,
      $select: ['_id', 'name', 'slug', 'avatar', 'lastActiveAt', 'termsAndConditionsAccepted', 'thumbnails']
    }
  }
};

const organizationSchema = {
  include: {
    service: 'organizations',
    nameAs: 'organization',
    parentField: 'relatedOrganizationId',
    childField: '_id',
    query: {
      $limit: 1,
      $select: ['_id', 'userId', 'name', 'slug', 'logo', 'thumbnails']
    }
  }
};

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [
      unless(isAdmin,
        restrictToOwner()
      )
    ],
    get: [ ...restrict ],
    create: [ disallow('external') ],
    update: [ ...restrict ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      populate({ schema: organizationSchema }),
      populate({ schema: contributionSchema }),
      populate({ schema: commentSchema }),
      populate({ schema: userSchema })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
