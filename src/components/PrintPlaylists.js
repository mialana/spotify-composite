import React, { useEffect, useState } from "react";

export default (props) => {
    const [data, setData] = useState([]);

    return (
    <div>
        {props.dataObject?.items ? props.dataObject.items.map((item) => <div key={item.id}><div>{item.name}</div></div>) : null}
    </div>
    )
};