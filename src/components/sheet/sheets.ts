import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CurrentProfilePostActions from '@/components/sheet/current-profile-post-actions/CurrentProfilePostActions';
import { Post } from '@/schemas/models/post';
import PostActions from '@/components/sheet/post-actions/PostActions';

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
