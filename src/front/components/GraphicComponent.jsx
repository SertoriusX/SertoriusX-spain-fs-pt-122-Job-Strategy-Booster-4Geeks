import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const GraficoDinamico = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setStats([
                { name: "Postulaciones", value: 10, color: "#25d568ff" },
                { name: "Entrevistas", value: 5, color: "#3662dcff" },
                { name: "Ofertas", value: 2, color: "#c1ef36ff" },
                { name: "Descartado", value: 10, color: "#e83636ff" }
            ]);
        }, 1000);
    }, []);


    const option = {
        series: [
            {
                type: 'pie',
                radius: ['45%', '65%'],
                label: { show: false },
                emphasis: {
                    disabled: false
                },
                data: stats.map(item => ({
                    value: item.value,
                    itemStyle: {
                        color: item.color
                    }
                }))
            }
        ]
    };

    return (
        <div className="grafico_container">

            <div className="grafico_chart">
                <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />
            </div>

            <div className="grafico_stats">
                {stats.map((item) => (
                    <div key={item.name} className="grafico_stat" style={{ '--stat-color': item.color }}>
                        <span className="grafico_label">{item.name}</span>
                        <span className="grafico_value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );;
};

export default GraficoDinamico;
