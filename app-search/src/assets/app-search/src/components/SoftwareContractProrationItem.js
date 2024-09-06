import React from "react";
import { t } from '@insight/toolkit-utils'

const SoftwareContractProrationItem = () => {
    return(
        <div className="prorationItem"><b>{t('Software Agreement:')} </b> {t('The price displayed will be prorated in the cart based on the remaining agreement period.')}</div>
    )
}

export default SoftwareContractProrationItem