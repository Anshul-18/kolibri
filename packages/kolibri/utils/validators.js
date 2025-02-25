import values from 'lodash/values';
import { ContentNodeKinds, LearningActivities } from 'kolibri/constants';
import every from 'lodash/every';
import keys from 'lodash/keys';

/**
 * Validation for vue router "location descriptor objects".
 * See e.g. https://router.vuejs.org/en/api/router-link.html
 */
export function validateLinkObject(object) {
  const validKeys = ['name', 'path', 'params', 'query'];
  return every(keys(object), key => validKeys.includes(key));
}

export function validateUsername(username) {
  const hasPuncRe = /[\s`~!@#$%^&*()\-+={}\[\]\|\\\/:;"'<>,\.\?]/; // eslint-disable-line
  return !hasPuncRe.test(username);
}

export function validateContentNodeKind(value, others = []) {
  return [...values(ContentNodeKinds), ...others].includes(value);
}

export function validateLearningActivity(arr) {
  if (!arr.length) {
    return true;
  }
  const isValidLearningActivity = v => Object.values(LearningActivities).includes(v);
  return arr.every(isValidLearningActivity);
}
