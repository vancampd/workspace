import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Map from './Map';

const listings = [
  {
    id: 'a1',
    title: 'Sunny Loft',
    price: '$30',
    description: 'A bright loft downtown',
    images: ['/loft.jpg'],
    coordinates: { lat: '40.7', lng: '-74' },
  },
  {
    id: 'b2',
    title: 'Quiet Studio',
    price: '25',
    description: 'A calm studio space',
    images: [],
    coordinates: { lat: '40.8', lng: '-74.1' },
  },
];

describe('Map', () => {
  it('shows no preview until a pin is hovered', async () => {
    const user = userEvent.setup();
    render(<Map listings={listings} />);

    expect(screen.queryByText('Sunny Loft')).not.toBeInTheDocument();
    expect(screen.queryByText('$30')).not.toBeInTheDocument();

    const pin = screen.getByRole('link', { name: 'View Sunny Loft' });
    await user.hover(pin);

    expect(screen.getByText('Sunny Loft')).toBeInTheDocument();
    expect(screen.getByText('$30')).toBeInTheDocument();
    expect(screen.getByText('A bright loft downtown')).toBeInTheDocument();
    expect(screen.queryByText('Quiet Studio')).not.toBeInTheDocument();

    await user.unhover(pin);

    expect(screen.queryByText('Sunny Loft')).not.toBeInTheDocument();
    expect(screen.queryByText('$30')).not.toBeInTheDocument();
  });

  it('shows the preview on keyboard focus and hides it on blur', async () => {
    const user = userEvent.setup();
    render(<Map listings={listings} />);

    await user.tab();
    expect(screen.getByText('Sunny Loft')).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByText('Sunny Loft')).not.toBeInTheDocument();
    expect(screen.getByText('Quiet Studio')).toBeInTheDocument();
  });
});
