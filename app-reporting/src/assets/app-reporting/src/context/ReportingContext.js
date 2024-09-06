import React from 'react';
import { Loading } from '@insight/toolkit-react';
import { useAccountToolsMenuDetails } from '../hooks';

/** Reporting Context */
export const ReportingContext = React.createContext({
	permissions: {},
})
ReportingContext.displayName = 'ReportingContext';

/** Reporting Context Provider */
export const ReportingProvider = (props) => {
	const { children } = props;

	const [permissions, loading, error] = useAccountToolsMenuDetails();
	if (loading || error) {
		let view = (
			<div>
				<Loading />
			</div>
		);

		if (error) view = <div>{error}</div>
		return <div className="c-reporting-view">{view}</div>
	}

	return (
		<ReportingContext.Provider
			value={{
				permissions,
			}}
		>
			{children}
		</ReportingContext.Provider>
	)
}
