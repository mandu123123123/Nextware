import React, {useEffect, useState} from "react";
import axios from "axios";

function OrganizationChart() {

    const director = "A001";
    const teacher = "A002";

    const [organizationChart, setOrganizationChart] = useState([]);

    useEffect(() => {
        getOrganizationChart();
    }, [])

    // A001 - 원장
    // A002 - 강사
    // 지금은 테스트 중이라 A001, A002 너무 많음
    // 나중에 다 없애고 그때 조직도 정보 뿌려야 될 듯
    // 일단 하드코딩 함

    const getOrganizationChart = async () => {
        try {
            const res = await axios.get(`/organization-chart?director=${director}&teacher=${teacher}`);
            // console.log(res.data.teachers);
            setOrganizationChart(res.data.teachers);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md mt-6" style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
                <div className="flex justify-center mt-8 text-3xl mr-10">넥스트IT 조직도</div>
                <p className="border mb-4 mt-6 ml-6 mr-6"></p>
                <div className="ml-10">
                <div className="grid grid-cols-3 gap-4 place-items-center mb-2">
                    <div></div>
                    <div
                        className="mt-4 flex-wrap flex flex-col justify-center max-w-xs p-2 shadow-md rounded-xl sm:px-12 bg-white dark:text-gray-800">
                        <p className="text-center mb-4 text-lg">원장</p>
                        <p className="border mb-4"></p>
                        <img
                            src="/kjh.png"
                            alt=""
                            className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
                        />
                        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                            <div className="my-2 space-y-1 mt-6">
                                <h2 className="text-xl font-semibold sm:text-2xl">
                                    {
                                        organizationChart.map((v, i) => {
                                            return (
                                                v.name == "김정환" ? v.name : null
                                            )
                                        })
                                    }
                                </h2>
                                <p className="px-5 text-xs sm:text-base dark:text-gray-600">
                                    Kim Jeong Hwan
                                </p>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>

                <div className="grid grid-cols-3 gap-4 place-items-center mt-1 mx-4">
                    <div
                        className="mt-8 flex-wrap flex flex-col justify-center max-w-xs p-2 shadow-md rounded-xl sm:px-12 bg-white dark:text-gray-800">
                        <p className="text-center mb-4 text-lg">강사</p>
                        <p className="border mb-4"></p>
                        <img
                            src="/sjm.png"
                            alt=""
                            className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
                        />
                        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                            <div className="my-2 space-y-1 mt-6">
                                <h2 className="text-xl font-semibold sm:text-2xl">
                                    {
                                        organizationChart.map((v, i) => {
                                            return (
                                                v.name == "서지민" ? v.name : null
                                            )
                                        })
                                    }
                                </h2>
                                <p className="px-5 text-xs sm:text-base dark:text-gray-600">
                                    Seo Ji Min
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-8 flex-wrap flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 bg-white dark:text-gray-800">
                        <p className="text-center mb-4 text-lg">강사</p>
                        <p className="border mb-4"></p>
                        <img
                            src="/lds.png"
                            alt=""
                            className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
                        />
                        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                            <div className="my-2 space-y-1 mt-6">
                                <h2 className="text-xl font-semibold sm:text-2xl">
                                    {
                                        organizationChart.map((v, i) => {
                                            return (
                                                v.name == "이다솔" ? v.name : null
                                            )
                                        })
                                    }
                                </h2>
                                <p className="px-5 text-xs sm:text-base dark:text-gray-600">
                                    Lee Da Sol
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-8 flex-wrap flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 bg-white dark:text-gray-800">
                        <p className="text-center mb-4 text-lg">강사</p>
                        <p className="border mb-4"></p>
                        <img
                            src="/hch.png"
                            alt=""
                            className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
                        />
                        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                            <div className="my-2 space-y-1 mt-6">
                                <h2 className="text-xl font-semibold sm:text-2xl">
                                    {
                                        organizationChart.map((v, i) => {
                                            return (
                                                v.name == "한창희" ? v.name : null
                                            )
                                        })
                                    }
                                </h2>
                                <p className="px-5 text-xs sm:text-base dark:text-gray-600">
                                    Han Chang Hui
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default OrganizationChart;
