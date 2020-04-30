import React from 'react';
import renderer from 'react-test-renderer';

import Item from './item.jsx';

it('Item is rendered correctly', () => {
  const {song} = mock;

  const tree = renderer.create(<Item
    apartament = { element }
    key = { index }
    onActiveOffer = {jest.fn()}
    onAddUser = {jest.fn()}
    userBookmarks = {userBookmarks}
    userId = {userId} />, {
    createNodeMock: () => {
      return {};
    }
  }).toJSON();

  expect(tree).toMatchSnapshot();
});