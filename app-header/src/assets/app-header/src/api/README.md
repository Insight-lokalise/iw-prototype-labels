# Header APIs

This document describes the APIs expected and required by the header components. Ideally, the US and EMEA APIs would be identical, confirming exact to the schemas shown in this document, however, the header project implements a mapping layer to cope with any inherent differences.

## getCartItemCount

Called by the `<CartLink>` component to retrieve a single count of how many items the user has in their shopping cart/basket.

```js
{
  itemCount: 42
}
```

## getMenuItems

Called by the `<MainNav>` component when rendering the main navigation menu.

```js
[
  {
    id: 'de54510adb8d3fc...1194',
    title: 'Learn',
    description: 'about trending topics',
    type: 'default',
    url: 'https://google.com',
    nodes: [ /* second-level nodes */ ],
    appearsWhen: 'always',
    tracking: {
      gtm: {
        event: 'learnNav',
        info: 'Learn'
      }
    },
    rtp: {
      marketo: {
        zoneId: 'dropdown-learn-right'
      }
    }
  }, {
    /* more top-level nodes */
  }
]
```

### Details

#### `type`

- Accepted values: `'default'`, `'heading'`, and `'external'`.
- Default value: `'default'`.

#### `appearsWhen`

- Accepted values: `'always'`, `'logged-in'`, and `'logged-out'`.
- Default value: `'always'`.

### Notes

- Due to the shear number of menu items – to reduce data sent over the wire – it would be preferable if fields were omitted where the value is `null` or matches the default value.

## getSearchSuggestions

Called by the `<SearchBar>` component – after a delay – as the user begins typing.

```js
[
  {
    phrase: 'suggestion phrase 1',
    href: '/insightweb/relativeURL1',
    category: 'laptops'
  }, {
    phrase: 'suggestion phrase 2',
    href: '/insightweb/relativeURL2',
    category: 'software'
  }
]
```

## getUserInformation

### Logged out

```js
{
  insightPhoneNumber: 12345647890, // this changes based on locale and isSEWP
  isSEWP: false,
  locale: 'en_US',
}
```

### Logged in

```js
{
  insightPhoneNumber: 12345647890,
  isSEWP: false,
  locale: 'en_US',
  userInformation: {
    firstName: 'Joe',
    isB2b: false,
    lastName: 'Bloggs',
    notificationsCount: 3,
    webLoginProfileId: 3988295,
    webGroup: {
      id: 1,
      name: 'Web Group #1',
      countryCode: 'GB'
    },
    account: {
      id: 1,
      name: 'Account #1'
    },
    contract: {
      id: 1,
      name: 'Contract #1'
    },
    favoriteLinks: [
      {
        title: 'First Fav Link',
        href: '/viewCart'
      }, {
        title: 'Show me a dashboard',
        href: '/dashboard'
      }
    ]
  }
}
```

### Fields

#### `webloginProfileId`

- This value is required when switching to a different web group, regardless of which web group is selected.

### Notes

- Q: Could we drop `isLoggedIn`, since it can be calculated as follows: `isLoggedIn = userInformation !== null`?

  **A: We have decided to drop it.**

- Q: Are `contractName`, `webGroupName`, and `accountName` required, since the currently selected values are included in the responses when requesting contracts, web groups, and accounts?

  **A: Yes, it makes sense to include details of the currently selected web group, account, and contract in this response, but it should be the full records, rather than just the name, so that the account bar can be rendered _before_ the lists of all web groups, accounts, and contracts have been fetched.**

## getWebGroups

Web groups are a US-specific feature. This is called by the `<AccountBar>` component, to support the web group search and switching functionality.

```js
[
  {
    id: 1,
    name: 'Web Group #1',
    countryCode: 'GB'
  }, {
    id: 2,
    name: 'Web Group #2',
    countryCode: 'ES'
  }, {
    /* more web groups */
  }
]
```

### Details

#### `countryCode`

The country code should be an [ISO-3166-1 alpha-2 code](https://en.wikipedia.org/wiki/ISO_3166-1).

## getAccounts

This is called by the `<AccountBar>` component, to support the account search and switching functionality.

```js
[
  {
    id: 1,
    name: 'Account #1'
  }, {
    id: 2,
    name: 'Account #2'
  }, {
    /* more accounts */
  }
]
```

## getContracts

This is called by the `<AccountBar>` component, to support the contracts search and switching functionality.

```js
[
  {
    id: 1,
    name: 'Contract #1',
  }, {
    id: 2,
    name: 'Contract #2'
  }, {
    /* more contracts */
  }
]
```
