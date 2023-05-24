import React, {ReactNode} from 'react';

interface CusBoxProps {
    children?: ReactNode,
    header: string,
    className?: string
}

const CusBox = (props: CusBoxProps) => {
    return (
        <div className={"p-6 bg-white z-5 "+ props.className}>
            <h1>{props.header}</h1>
            {props.children}
        </div>
    );
};

export default CusBox;