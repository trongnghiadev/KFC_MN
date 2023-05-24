import React from 'react';
import useFetch, {fetchProps} from "./useFetch";

export interface supplierFetchProps {
    method: fetchProps["method"],
    id? :string,
    query?: string,
    sendData?: any
}

const useFetchSuppliers = (props: supplierFetchProps) => {
    const {method, id, query, sendData} = props
    const {data, isLoading, isError} = useFetch({
        method,
        path: "/suppliers/" + id || "",
        sendData, query
    })

    return [data, isLoading, isError];
};

export default useFetchSuppliers;