import React from 'react';
import { render } from '@testing-library/react';
import ReviewSubmissionForm from "./ReviewSubmissionForm";

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const bvInfo = {
  bvcampaignId: '1',
  bvuserToken: '213sedf',
  materialId: '23',
  fingerPrint:'',
  locale: ''
}

const setup = async () => {
  const wrapper = render(
    <ReviewSubmissionForm bvInfo={bvInfo}/>
)
  return {
    ...wrapper
  }
}

describe('Review SubmissionForm Component', () => {
  it('Should render the Review SubmissionForm Component', async () => {
    const {getByTestId} = await setup();
    expect(getByTestId('review-submission-form')).toBeInTheDocument();
  })
})


