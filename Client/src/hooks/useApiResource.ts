/*
this hook has zero knowledge of an specific entity
it takes any fetch function and manages loading/error/data state generically.
*/

import { useState, useEffect, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "../auth/getToken";


export function useApiResource<T>(fetcher: (token: string) => Promise<T[]>){
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {instance, accounts} = useMsal();


    const reloadData = useCallback(() => {
        if(accounts.length === 0) return;
        setLoading(true);
        getAccessToken(instance, accounts[0])
        .then(token => fetcher(token))
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        });

    }, [instance, accounts, fetcher]);

    useEffect(() => {
        reloadData();
    }, [reloadData]);

    return {data, loading, error, reloadData};
}