import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '@insight/toolkit-react'

const ErrorComponent = err => <div>{err}</div>
const LoadingComponent = (props) => {
	if (props.error) {
		return <div>Error! {props.error}</div>
	}
	return (
		<div className="c-app-views--loading">
			<Loading size="large" />
		</div>
	)
}

export const Admin = Loadable({
	loader: () => import('./Admin/Admin'),
	loading: LoadingComponent
})

export const Builder = Loadable({
	loader: () => import('./Builder/Builder'),
	loading: LoadingComponent
})

export const Edit = Loadable({
	loader: () => import('./edit/EditDeal'),
	loading: LoadingComponent
})

export const Landing = Loadable({
	loader: () => import('./Landing/Landing'),
	loading: LoadingComponent
})

export const List = Loadable({
	loader: () => import('./List/List'),
	loading: LoadingComponent
})

export const Preview = Loadable({
	loader: () => import('./Preview/Preview'),
	loading: LoadingComponent
})

export const Submission = Loadable({
	loader: () => import('./Submission/Submission'),
	loading: LoadingComponent
}) 

export const AccessDenied = Loadable({
  loader: () => import('./access/AccessDenied'),
  loading: LoadingComponent
})

export const EditDeal = Loadable({
	loader: () => import('./edit/EditDeal'),
	loading: LoadingComponent
})
