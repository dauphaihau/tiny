import React from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp
} from 'react-native';
import {
  ArrowLeft,
  ArrowDown,
  Bell,
  BookmarkSimple,
  Camera,
  CameraRotate,
  CaretLeft,
  CaretRight,
  ChatCircle,
  ChatCircleDots,
  Check,
  DotsThreeCircle,
  Envelope,
  EnvelopeSimple,
  EyeSlash,
  Heart,
  House,
  Image,
  Images,
  Info,
  Link,
  List,
  MapPin,
  Microphone,
  Moon,
  Sun,
  PencilSimple,
  Plus,
  PlusCircle,
  PlusSquare,
  PushPin,
  Export,
  ShieldWarning,
  Trash,
  User,
  WarningCircle,
  WarningOctagon,
  MagnifyingGlass,
  X,
  Gear, Archive, Lock, DotsThreeOutline, ArrowUp, ArrowRight,
  IconProps as PhosphorIconProps
} from 'phosphor-react-native';
import { cssInterop } from 'nativewind';
import { cn } from '@/utils';

// Define color constants
const COLORS = {
  errorBackground: '#ffebee',
  errorText: '#d32f2f',
};

// Define available custom icon names
export type IconName =
  | 'chevron.left'
  | 'chevron.right'
  | 'arrow.up'
  | 'arrow.down'
  | 'arrow.right'
  | 'arrow.left'
  | 'bell'
  | 'bell.fill'
  | 'mail'
  | 'mail.fill'
  | 'dots.horizontal.circle'
  | 'dots.horizontal'
  | 'photo'
  | 'photos'
  | 'camera'
  | 'camera.rotate'
  | 'mic'
  | 'lock'
  | 'location'
  | 'trash'
  | 'heart'
  | 'heart.fill'
  | 'message.circle'
  | 'message.circle.dots'
  | 'message.circle.dots.fill'
  | 'plus'
  | 'plus.circle'
  | 'plus.square'
  | 'search'
  | 'search.fill'
  | 'bookmark'
  | 'pin'
  | 'archive'
  | 'edit'
  | 'sun'
  | 'moon'
  | 'report'
  | 'eye.off'
  | 'link'
  | 'menu'
  | 'user'
  | 'settings'
  | 'share'
  | 'home.fill'
  | 'home'
  | 'check'
  | 'close'
  | 'info'
  | 'warning'
  | 'error';

// Map of icon components from phosphor-react-native
const ICON_COMPONENTS = {
  'chevron.left': CaretLeft,
  'chevron.right': CaretRight,
  'arrow.right': ArrowRight,
  'arrow.left': ArrowLeft,
  'arrow.up': ArrowUp,
  'arrow.down': ArrowDown,
  bell: Bell,
  'bell.fill': Bell,
  mail: EnvelopeSimple,
  'mail.fill': Envelope,
  'dots.horizontal.circle': DotsThreeCircle,
  'dots.horizontal': DotsThreeOutline,
  photo: Image,
  photos: Images,
  camera: Camera,
  'camera.rotate': CameraRotate,
  mic: Microphone,
  location: MapPin,
  trash: Trash,
  heart: Heart,
  'heart.fill': Heart,
  plus: Plus,
  'plus.circle': PlusCircle,
  'plus.square': PlusSquare,
  search: MagnifyingGlass,
  'search.fill': MagnifyingGlass,
  bookmark: BookmarkSimple,
  pin: PushPin,
  archive: Archive,
  edit: PencilSimple,
  sun: Sun,
  moon: Moon,
  lock: Lock,
  report: WarningOctagon,
  'eye.off': EyeSlash,
  link: Link,
  menu: List,
  user: User,
  settings: Gear,
  share: Export,
  'message.circle': ChatCircle,
  'message.circle.dots': ChatCircleDots,
  'message.circle.dots.fill': ChatCircleDots,
  'home.fill': House,
  home: House,
  check: Check,
  close: X,
  info: Info,
  warning: ShieldWarning,
  error: WarningCircle,
};

// Type for the component props
export interface IconProps {
  name: IconName | string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  weight?: PhosphorIconProps['weight']
  className?: string
  [key: string]: unknown; // For other props we want to pass through
}

// Type for our styles
interface Styles {
  errorContainer: ViewStyle;
  errorText: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  weight = 'regular',
  className,
  ...props
}) => {
  // Get the icon component from our mapping
  const BaseIconComponent = ICON_COMPONENTS[name as IconName];

  const IconComponent = cssInterop(BaseIconComponent, {
    className: 'style',
  });

  // Auto set weight
  let iconWeight = weight;
  if (name.includes('fill') || name === 'dots.horizontal') {
    iconWeight = 'fill';
  }

  if (!IconComponent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Icon not found: {name}</Text>
      </View>
    );
  }

  return (
    <IconComponent
      size={size}
      weight={iconWeight}
      className={cn('text-foreground', className)}
      {...props}
    />
  );
};

const styles = StyleSheet.create<Styles>({
  errorContainer: {
    backgroundColor: COLORS.errorBackground,
    borderRadius: 4,
    padding: 5,
  },
  errorText: {
    color: COLORS.errorText,
    fontSize: 12,
  },
});
