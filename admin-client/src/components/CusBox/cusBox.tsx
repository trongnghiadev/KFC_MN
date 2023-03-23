import React, {ReactNode} from 'react';

interface CusBoxProps {
    children?: ReactNode,
    header: string
}

const CusBox = (props: CusBoxProps) => {
    return (
        <div className={"p-6 bg-white rounded-md"}>
            <h1>{props.header}</h1>
            {props.children}
        </div>
    );
};

export default CusBox;