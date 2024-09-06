import { useState, useEffect } from 'react';
import { getAccountToolsMenuDetails } from '../api';

export const useAccountToolsMenuDetails = (deps = []) => {
    const [{ data, loading, error }, setMenu] = useState({
        data: null,
        loading: true,
        error: null,
    })

    const fetchAccountToolsMenu = async () => {
        try {
            const permissions = await getAccountToolsMenuDetails();
            setMenu({
                data: permissions,
                loading: false,
                error: null,
            });
        } catch (err) {
            setMenu({
                loading: false,
                error: err.message
            });
        }
    }
    useEffect(() => {
        fetchAccountToolsMenu();
        return () => null;
    }, [...deps])

    return [data, loading, error];
}