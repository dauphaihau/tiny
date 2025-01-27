import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CurrentProfilePostActions from '@/components/sheet/current-profile-post-actions/CurrentProfilePostActions';
import PostActions from '@/components/sheet/post-actions/PostActions';
import { Post } from '@/types/models/post';

registerSheet('current-profile-post-actions', CurrentProfilePostActions);
registerSheet('post-actions', PostActions);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'current-profile-post-actions': SheetDefinition<{
      payload: {
        postId: Post['id']
      }
    }>;
    'post-actions': SheetDefinition<{
      payload: {
        postId: Post['id']
      }
      returnValue: boolean;
    }>;
  }
}
