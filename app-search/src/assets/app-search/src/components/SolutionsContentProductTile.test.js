import React from 'react'
import { render } from '@testing-library/react'
import SolutionsContentProductTile from './SolutionsContentProductTile'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
	t: jest.fn((string) => string),
}))

describe('<SolutionsContentProductTile />', () => {
	test('should render solutions Data Product Tile', async () => {
		const doc = {
			docId: 'fa2927479121a8b9acc2f9447697cd1a549898cdbdcfe263d3be76a1f8b4b81a',
			title: 'Managed Endpoint for Apple Devices',
			description:
				'Insight’s Managed Endpoint for Apple Devices is a modern approach to device management that reduces cost complexity and maximizes ROI of licenses and infrastructure to allow Apple device options and keep employees satisfied.',
			imageUrl:
				'/content/dam/insight-web/en_US/article-images/2023/managed-endpoint-for-apple-devices.jpg',
			pagePath:
				'/en_US/content-and-resources/2022/managed-endpoint-for-apple-devices.html',
			createdDate: '2022-08-16T03:46:00.000+00:00',
			updatedDate: '2023-07-25T21:42:57.177+00:00',
			displayDate: '15 Aug 2022',
			contentType: 'Solution brief',
			author: 'Insight Editor',
			industry: 'Enterprise',
			brand: 'Enterprise',
			topics: null,
			isContentSlide: true
		}
		const view = 'grid';

		const setup = async () => {
			const wrapper = render(<SolutionsContentProductTile doc={doc} view={view} />)

			return {
				...wrapper,
			}
		}

		const { getByText, container } = await setup()

		expect(container.querySelector('.c-solutions-product-title')).toBeInTheDocument()
		expect(getByText(doc.title)).toBeInTheDocument()
	})
})
