import { postsRef } from './';

export const copyPostModalityIntoPostModalitiesForAllPosts = () => {
  postsRef().once('value', (snapshot) => {
    const posts = snapshot.val();
    Object.entries(posts).forEach(([id, post]) => {
      if (post.modality) {
        postRef(id)
          .child('modalities')
          .child(post.modality.name)
          .set(post.modality);
        postRef(id).child('modality').remove();
      }
    });
  });
};
