import type { Meta, StoryObj } from '@storybook/react';
import { Image, ImageProps } from './Image';

const SAMPLE_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#dbe4ff"/>
      <circle cx="200" cy="160" r="70" fill="#8fa8ff"/>
      <rect x="60" y="260" width="280" height="24" rx="12" fill="#8fa8ff"/>
    </svg>`
  );

// Portrait, with a distinct marker near the top ("head") and another near the
// bottom ("feet") — a square source can't demonstrate object-position, since
// nothing gets cropped when the box already matches the source ratio.
const PORTRAIT_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800">
      <rect width="100%" height="100%" fill="#dbe4ff"/>
      <circle cx="200" cy="120" r="70" fill="#f2a154"/>
      <text x="200" y="130" font-size="20" text-anchor="middle" fill="#fff">top</text>
      <rect x="130" y="640" width="140" height="70" rx="12" fill="#5566ee"/>
      <text x="200" y="682" font-size="20" text-anchor="middle" fill="#fff">bottom</text>
    </svg>`
  );

interface ImageStoryProps extends ImageProps {}

const meta: Meta<ImageStoryProps> = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL. Omit to render the placeholder fill state.',
    },
    alt: {
      control: 'text',
      description: 'Accessible description',
    },
    aspectRatio: {
      control: 'select',
      options: ['1:1', '4:3', '5:4', '16:9', '16:10', '3:4', '4:5', '9:16', '10:16', 'Fill'],
      description: 'Aspect ratio variant — landscape set matches Figma "Image" component; portrait set mirrors it vertically',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'stretch'],
      description: 'How the image fills its box — cover crops, contain letterboxes, stretch distorts to fill exactly',
    },
    objectPosition: {
      control: 'text',
      description: 'Focal point kept visible when objectFit="cover" crops the image',
    },
  },
};

export default meta;
type Story = StoryObj<ImageStoryProps>;

export const Default: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: 'Sample illustration',
    aspectRatio: '1:1',
  },
};

export const Placeholder: Story = {
  args: {
    alt: 'Coming soon',
    aspectRatio: '1:1',
  },
};

export const Square1to1: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '1:1' },
};

export const Ratio4to3: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '4:3' },
};

export const Ratio5to4: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '5:4' },
};

export const Ratio16to9: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '16:9' },
};

export const Ratio16to10: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '16:10' },
};

export const Ratio3to4: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: PORTRAIT_SRC, alt: 'Sample illustration', aspectRatio: '3:4' },
};

export const Ratio4to5: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: PORTRAIT_SRC, alt: 'Sample illustration', aspectRatio: '4:5' },
};

export const Ratio9to16: Story = {
  render: (args) => (
    <div style={{ width: 200 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: PORTRAIT_SRC, alt: 'Sample illustration', aspectRatio: '9:16' },
};

export const Ratio10to16: Story = {
  render: (args) => (
    <div style={{ width: 200 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: PORTRAIT_SRC, alt: 'Sample illustration', aspectRatio: '10:16' },
};

export const Fill: Story = {
  render: (args) => (
    <div style={{ width: 320, height: 200 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: 'Fill' },
};

export const ObjectFitContain: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Sample illustration', aspectRatio: '1:1', objectFit: 'contain' },
};

// stretch: fills the box exactly with no crop and no letterbox, by distorting
// the source to match — a deliberate trade when the source ratio is already
// close to the box's, so the distortion is barely visible but the empty
// space (contain) or lost edges (cover) would be more noticeable.
export const ObjectFitStretch: Story = {
  render: (args) => (
    <div style={{ width: 320, height: 200 }}>
      <Image {...args} />
    </div>
  ),
  args: { src: PORTRAIT_SRC, alt: 'Sample illustration', aspectRatio: 'Fill', objectFit: 'stretch' },
};

// All Aspect Ratios Comparison
export const AllAspectRatios: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: 900 }}>
      {(['1:1', '4:3', '5:4', '16:9', '16:10', 'Fill'] as const).map((ratio) => (
        <div key={ratio}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>{ratio}</div>
          <div style={{ height: ratio === 'Fill' ? 160 : undefined }}>
            <Image src={SAMPLE_SRC} alt={`${ratio} example`} aspectRatio={ratio} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// Portrait ratios — each one the vertical mirror of a landscape ratio above.
export const AllPortraitRatios: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: 900 }}>
      {(['3:4', '4:5', '9:16', '10:16'] as const).map((ratio) => (
        <div key={ratio}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>{ratio}</div>
          <Image src={PORTRAIT_SRC} alt={`${ratio} example`} aspectRatio={ratio} />
        </div>
      ))}
    </div>
  ),
};

// Placeholder vs. Loaded Comparison
export const PlaceholderVsLoaded: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: 240 }}>
        <Image alt="Placeholder" aspectRatio="4:3" />
      </div>
      <div style={{ width: 240 }}>
        <Image src={SAMPLE_SRC} alt="Loaded" aspectRatio="4:3" />
      </div>
    </div>
  ),
};

// objectPosition: which part of a cropped image stays visible. Only matters
// with objectFit="cover" (contain never crops, so there's no focal point to
// preserve). Portrait source cropped into a 1:1 box three ways.
export const ObjectPosition: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['top', 'center', 'bottom'] as const).map((pos) => (
        <div key={pos} style={{ width: 160 }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>objectPosition=&quot;{pos}&quot;</div>
          <Image
            src={PORTRAIT_SRC}
            alt={`Cropped, position ${pos}`}
            aspectRatio="1:1"
            objectFit="cover"
            objectPosition={pos}
          />
        </div>
      ))}
    </div>
  ),
};

// Clickable (composition pattern for lightbox/zoom, owned by the caller).
// onClick makes the frame keyboard-focusable (role="button", tabIndex 0) and
// triggers on Enter/Space, not just pointer click.
export const Clickable: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} onClick={() => alert('Open a caller-owned lightbox here')} />
    </div>
  ),
  args: { src: SAMPLE_SRC, alt: 'Click me', aspectRatio: '1:1' },
};
