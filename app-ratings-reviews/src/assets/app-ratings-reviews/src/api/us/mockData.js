export const mockBasicResultsData = {
  results:{
    Limit : 10,
    TotalResults: 45,
    Locale: 'en_US',
    Reviews:[
      {
        Rating: 5,
        TotalNegativeFeedbackCount: 2,
        TotalPositiveFeedbackCount: 8,
        SubmissionTime: "2018-06-29T10:31:26.000+00:00",
        ReviewText: "Looks good!!Looks good!!,Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!Looks good!!",
        Title: "Book of Eli",
        UserNickname: "SteveN",
        IsRecommended: true,
        RatingRange: 5,
      },
      {
        Rating: 4,
        TotalNegativeFeedbackCount: 2,
        TotalPositiveFeedbackCount: 8,
        SubmissionTime: "2018-06-29T10:31:26.000+00:00",
        ReviewText: "4 star rating comment",
        Title: "Testing 4 star",
        UserNickname: "Star",
        IsRecommended: true,
        RatingRange: 5,
      },
    ],
    ReviewStatistics:{
      RatingDistribution: [
        {RatingValue: 5,Count: 28},
        {RatingValue: 4,Count: 21},
        {RatingValue: 3,Count: 3},
        {RatingValue: 1,Count: 1},
        {RatingValue: 2,Count: 1},
      ],
      AverageOverallRating: 4,
    },
    HasErrors: false,
    Errors: [],
  }
}
