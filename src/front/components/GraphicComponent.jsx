import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const GraficoDinamico = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        // Simulación de API
        setTimeout(() => {
            setStats([
                { name: "Postulaciones", value: 10 },
                { name: "Entrevistas", value: 2 },
                { name: "Ofertas", value: 2 },
                { name: "Descartado", value: 2 }
            ]);
        }, 1000);
    }, []);

    const option = {
        series: [
            {
                type: "pie",
                radius: ["50%", "80%"],
                label: { show: false },
                labelLine: { show: false },
                data: stats
            }
        ]
    };

    return (
        <div className="grafico_container">

            <div className="grafico_chart">
                <ReactECharts option={option} />
            </div>

            <div className="grafico_stats">
                {stats.map((item) => (
                    <div key={item.name} className="grafico_stat">
                        <span className="grafico_label">{item.name}</span>
                        <span className="grafico_value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );;
};

export default GraficoDinamico;
