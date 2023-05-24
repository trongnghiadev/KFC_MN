import React, {useEffect, useState} from 'react';
import IWarehouse from "../../../../../Interfaces/warehouse.interface";
import Chart, {Props} from "react-apexcharts"
import NoDataFound from "../../../../../components/NoDataFound/noDataFound";
import Facility from "../../Facility/facility";
import facility from "../../Facility/facility";

type warehouseProps = {
    warehouse:IWarehouse
    options?: {
        facilities?: boolean,
        ingredients?: boolean
    }
}

const WarehouseDetailChart = (props:warehouseProps) => {
    const {warehouse, options} = props;

    // Props is for Chart props type
    const [chartOptions, setChartOptions] = useState<{ facilities: Props, ingredients: Props }>(
        {
            facilities: {
                type: "donut",
                height: 300,
                width: '100%',
                options: {
                    labels: ["Available", "Unavailable", "Issue"],
                    colors: ["#007926", "#a3da32", "#e70000"],
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: true,
                                    name: {show:true},
                                    value: {show:true},
                                    total: {show: true}
                                }
                            }
                        }
                    }
                }
            },
            ingredients: {
                type: "donut",
                height: 300,
                width: '100%',
                options: {
                    labels: ["Available", "Unavailable", "Out of stock"],
                    colors: ["#007926", "#a3da32", "#e70000"],
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: true,
                                    name: {show:true},
                                    value: {show:true},
                                    total: {show: true}
                                }
                            }
                        }
                    }
                }
            },
        }
    )
    useEffect(()=>{
        let facilityStates = {available: 0, unavailable: 0, issue: 0}
        warehouse.facilities?.forEach((facility)=>{
            switch (facility.state){
                case "available":
                        facilityStates.available += parseFloat(facility.amount) - parseFloat(facility.issue_amount || "0")
                        facilityStates.issue += parseFloat(facility.issue_amount || '0')
                    break
                case "unavailable":
                case "blocked":
                    facilityStates.unavailable += parseFloat(facility.amount)
                    break
            }
        })
        let ingredientStates = {available: 0, unavailable: 0, ofs: 0}
        warehouse.ingredients?.forEach((ingredient)=>{
            switch (ingredient.state){
                case "available":
                        ingredientStates.available += 1
                    break
                case "unavailable":
                    ingredientStates.unavailable += 1
                    break
                case "ofs":
                    ingredientStates.ofs += 1
                    break
            }
        })

        setChartOptions((prev)=>
            ({...prev, facilities:
                    {...prev.facilities,
                        series: [facilityStates.available, facilityStates.unavailable, facilityStates.issue]},
                    ingredients:
                        {...prev.ingredients,
                        series: [ingredientStates.available, ingredientStates.unavailable, ingredientStates.ofs]},

                }
            ))
    }, [warehouse])
    return (
        <div className={"relative flex flex-col md:flex-row gap-4 mt-6 w-full"}>
            {warehouse.facilities && warehouse.facilities?.length > 0 &&
                <div className={"bg-white p-6 w-full max-w-full rounded shadow"}>
                    <h2 className={"text-center mb-4"}>Facility Report</h2>
                    <Chart {...chartOptions.facilities} className={"facilitiesChart"}/>
                </div>
            }
            {!warehouse.facilities || warehouse.facilities?.length == 0 && <NoDataFound title={"No data found for facilities"}/>}

            {warehouse.ingredients && warehouse.ingredients?.length > 0 &&
                <div className={"bg-white p-6 w-full max-w-full rounded shadow"}>
                    <h2 className={"text-center mb-4"}>Ingredients Report</h2>
                    <Chart {...chartOptions.ingredients} className={"ingredientsChart"}/>
                </div>
            }
            {!warehouse.ingredients || warehouse.ingredients?.length == 0 && <NoDataFound title={"No data found for ingredients"}/>}
        </div>
    );
};

export default WarehouseDetailChart;