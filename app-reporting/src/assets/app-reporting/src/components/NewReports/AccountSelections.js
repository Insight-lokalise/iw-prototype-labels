import React, { useEffect, useState } from 'react'
import { Button, Field, Tooltip, Loading, connectToLocale } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { CREATE_REPORT, REPORTING_TEXTS } from '../../texts'
import cn from 'classnames'
import { getHierarchyTree, getRegions } from '../../api'
import { REGIONS, ACCOUNT_SELECTION_CODE } from '../../constants'
import { ACCOUNT_SELECTION_DROPDOWN, ACCOUNT_SELECTION_DROPDOWN_REGION, ALL_OPTIONS } from './static/FieldValues/FieldValues'
import { Hierarchy, SelectRegion } from './tooltips'
const { ACCOUNT_SELECTION, SELECTED_OPERATIONS_CENTER, SELECTED_REGIONS, HIDE_HIERARCHY, SHOW_HIERARCHY, UPDATE } = CREATE_REPORT
const { NO_ACCOUNTS_FOUND } = REPORTING_TEXTS

const AccountSelections = ({ context }) => {
  const [loading, setLoading] = useState(true)
  const [hierarchyList, setHierarchyList] = useState(null)
  const [hideAccount, setHideAccount] = useState([])
  const [hideHierarcyTable, setHideHierarcyTable] = useState(false)
  const [accountRegion, setAccountRegion] = useState(null)
  const [hierarchyData, setHierarchyData] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const { userInformation } = context
  const {
    account: { soldToId },
    webGroup: { webGroupId },
    webLoginProfileId
  } = userInformation

  const [hierarchyPayload, setHierarchyPayload] = useState({
    levelIndex: 1,
    clientExperienceId: webGroupId,
    webLoginProfileId: webLoginProfileId,
    partnerNumber: soldToId,
    limitAccount: 1,
    requestFrom: "report",
    selectedSalesOrg: REGIONS.ALL.code
  })


  useEffect(() => {
    getRegions().then((response) => {
      setAccountRegion(response)
    }).catch((err) => {
      console.warn(err)
      setAccountRegion(null)
    })
  }, [])

  useEffect(() => {
    if ((hierarchyPayload?.levelIndex === ACCOUNT_SELECTION_CODE.ACCOUNT_BY_REGION && selectedRegion === null) || hierarchyPayload?.levelIndex === ACCOUNT_SELECTION_CODE.CUSTOM_LIST) {
      return
    }
    setLoading(true)
    getHierarchyTree({
      ...hierarchyPayload,
      levelIndex: hierarchyPayload?.levelIndex === ACCOUNT_SELECTION_CODE.ACCOUNT_BY_REGION ? ACCOUNT_SELECTION_CODE.ACCOUNT_UNDER_REPORTING_GREAT_GRANT_PARENT : hierarchyPayload.levelIndex
    })
      .then((response) => {
        setHierarchyList(response)
      })
      .catch((err) => {
        console.warn(err)
        setHierarchyList(null)
        setHierarchyData([])
        setLoading(false)
      })
  }, [hierarchyPayload])

  let parentIds = []

  useEffect(() => {
    setLoading(true)
    const extractAccounts = (content) => {
      let flatContent = []
      content?.forEach((obj) => {
        if (!parentIds.includes(obj.pid)) {
          parentIds.push(obj.pid)
        }
        parentIds.length = parentIds.includes(obj.id)
          ? 0
          : parentIds.indexOf(obj.pid) + 1
        const info = {
          name: obj.name,
          id: obj.id,
          pid: obj.pid,
          selected: obj.selected,
          active: hierarchyPayload.levelIndex === ACCOUNT_SELECTION_CODE.CUSTOM_LIST ? true : obj.active,
          address: obj.address,
          city: obj.city,
          state: obj.state,
          country: obj.country,
          opsCenterId: obj.opsCenterId,
          index: parentIds.indexOf(obj.pid) + 1,
          hasChild: obj.children ? true : false,
          hierarchy: [...parentIds, obj.id].join('-'),
        }
        flatContent.push(info)
        if (obj.children) {
          flatContent = flatContent.concat(extractAccounts(obj.children))
        }
      })
      return flatContent
    }
    const mapData = extractAccounts(hierarchyList?.content)
    setHierarchyData(mapData)
    setLoading(false)
  }, [hierarchyList])

  const accountSelections = hierarchyList && (
    <div className="c-new-reports-category c-new-reports-input-group">
      <div className="c-new-reports-input-group__title">
        {t(ACCOUNT_SELECTION)}
      </div>
      <Field
        fieldComponent="Select"
        fullWidth
        handleChange={(e) => {
          const selectedIndex = e.target.value
          setHierarchyPayload((prevPayload) => ({
            ...prevPayload,
            levelIndex: selectedIndex,
            selectedSalesOrg: REGIONS.ALL.code
          }));
        }}
        name="Account Selection"
        options={(hierarchyData?.length && accountRegion) ? ACCOUNT_SELECTION_DROPDOWN_REGION : ACCOUNT_SELECTION_DROPDOWN}
        value={hierarchyPayload?.levelIndex}
      />
    </div>
  )

  const operationCenterSelection = hierarchyList && (
    <div className="c-new-reports-category c-new-reports-input-group">
      <div className="c-new-reports-input-group__title">
        {t(SELECTED_OPERATIONS_CENTER)}
      </div>
      <Field
        fieldComponent="Select"
        fullWidth
        handleChange={(e) => {
          const operationCenter = e.target.value
          const regionCode = Object.values(REGIONS).filter(region => region.name === operationCenter)[0].code
          setSelectedRegion(prev => ({
            ...prev,
            operationCenter: operationCenter,
            region: regionCode
          }))
        }}
        name={SELECTED_OPERATIONS_CENTER}
        options={[
          ...ALL_OPTIONS,
          ...accountRegion.map((region) => (
            { text: region.regionDescription, value: region.regionCode }
          ))
        ]}
        value={selectedRegion?.operationCenter}
      />
    </div>
  )

  const accountRegionSelection = hierarchyList && (
    <div className="c-new-reports-category c-new-reports-input-group">
      <div className="c-new-reports-input-group__title">
        {t(SELECTED_REGIONS)}
        <Tooltip content={SelectRegion()} className="">
          <span className='c-tooltip-report'>?</span>
        </Tooltip>
      </div>
      <Field
        fieldComponent="Select"
        fullWidth
        handleChange={(e) => {
          const selectedAccountRegion = e.target.value
          setSelectedRegion(prev => ({
            ...prev,
            region: selectedAccountRegion
          }))
        }}
        name={SELECTED_REGIONS}
        options={[
          ...ALL_OPTIONS,
          ...((selectedRegion && selectedRegion?.operationCenter !== 'All') ? accountRegion.filter(region => region.regionCode === selectedRegion?.operationCenter)[0]
            .hierarchyRegion?.map((region) => ({
              text: region.regionDescription,
              value: region.region
            })) : [])
        ]}
        value={selectedRegion?.region}
      />
    </div>
  )
  const updateRegion = () => {
    setHierarchyPayload((prevPayload) => ({
      ...prevPayload,
      selectedSalesOrg: selectedRegion?.region || REGIONS.ALL.code
    }))
  }

  const hideHierarchy = (
    <Button color="link" size="small" href="#" onClick={() => setHideHierarcyTable(!hideHierarcyTable)}>
      {t(hideHierarcyTable ? SHOW_HIERARCHY : HIDE_HIERARCHY)}
      <Tooltip content={t(Hierarchy())} className="">
        <span className='c-tooltip-report'>?</span>
      </Tooltip>
    </Button>
  )

  const handleHideAccountTree = (accountId) => {
    const accountHidden = hideAccount.indexOf(accountId) > -1
    if (accountHidden) {
      setHideAccount(hideAccount.filter((id) => id !== accountId))
    } else {
      setHideAccount([...hideAccount, accountId])
    }
  }

  const hideAccountTree = (accountHierarchies, accountId) => {
    let hidden = false;
    hideAccount.forEach((id) => {
      if (accountHierarchies.includes(id) && id !== accountId) {
        hidden = true;
        return
      }
    })
    return hidden
  }

  const isParentSelected = (account) => account.hasChild

  const selectAccount = (account) => {
    setHierarchyData(prevData => prevData.map((acc) => {
      if (acc.id === null) {
        return {
          ...acc,
          selected: !acc.selected
        }
      }
      if (isParentSelected) {
        return acc.hierarchy.includes(account.id) ? { ...acc, selected: !account.selected } : acc;
      }
      return acc.id === account.id ? { ...acc, selected: !acc.selected } : acc;
    }));
  };
  const hierarchyTable = (
    <div className="o-grid c-new-reports__hierarchy-table">
      <table>
        <thead>
          <tr>
            {hierarchyList?.headers?.map((header) => (
              <th>{header.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(hierarchyData?.length) ? hierarchyData?.map((row, i) => (
            <tr
              className={cn('index-' + row.index, {
                'c-new-reports__hierarchy-table__row--parent': row.hasChild,
                'u-hide': hideAccountTree(row.hierarchy, row.id),
              })}
              key={row.id}
            >
              <td>
                {(row.hasChild && row.id !== null) && (
                  <span
                    className={
                      cn('c-new-reports__hierarchy-table__row__toggle', {
                        'c-new-reports__hierarchy-table__row__toggle--close': hideAccount.includes(row.id),
                      })
                    } onClick={() => handleHideAccountTree(row.id)}></span>
                )}
                <Field
                  fieldComponent="Checkbox"
                  checkboxLabel={row.name || 'null'}
                  name="heirarchy"
                  value={row.id}
                  checked={row.selected}
                  disabled={hierarchyPayload.levelIndex !== ACCOUNT_SELECTION_CODE.CUSTOM_LIST}
                  horizontal={true}
                  onChange={() => selectAccount(row)}
                />
              </td>
              <td>{row.id ? row.id : 'null'}</td>
              <td>{row.id ? row.address : 'null'}</td>
            </tr>
          )) :
          <Loading />}
        </tbody>
      </table>
    </div>

  )

  const noAccountsFound = (
    <div className="c-new-reports-category c-new-reports-input-group">
      <div className="c-new-reports-input-group__title">
        {t(NO_ACCOUNTS_FOUND.text)}
      </div>
    </div>
  )
  return (
    <div className="c-new-reports-container">
      {hierarchyList?.selectionList ? (
        <div className="o-grid o-grid--center">
          <div className="o-grid__item u-1/1">
            {accountSelections}
            {hideHierarchy}
          </div>
          {
            hierarchyPayload?.levelIndex === ACCOUNT_SELECTION_CODE.ACCOUNT_BY_REGION && (
              <div className="o-grid__item u-1/1">
                {operationCenterSelection}
                {accountRegionSelection}
                <Button color="link" size="small" href="#" onClick={updateRegion}>
                  {t(UPDATE)}
                </Button>
              </div>
            )
          }
        </div>
      ) : null}
      {(loading || !hierarchyData?.length) ? (
        <Loading />
      ) : !hideHierarcyTable && hierarchyData?.length ? (
        hierarchyTable
      ) : null}
    </div>
  )
}

export default connectToLocale(AccountSelections)
