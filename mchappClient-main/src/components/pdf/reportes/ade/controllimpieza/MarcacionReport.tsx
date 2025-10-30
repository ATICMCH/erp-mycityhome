import React from "react"
import { jsPDF } from "jspdf"            
import autoTable, { RowInput } from 'jspdf-autotable'
import UtilCustomInstance from "@/client/helpers/UtilCustom"
import { LOGO_MCH_B64, MARGINS_REPORT } from "@/client/helpers/constants"
import { AiOutlineFilePdf } from "react-icons/ai"

type propsInput = {
    lData: Array<dataList>,
    dateStart: string,
    dateEnd: string
}

type dataList = {
    idusuario: number
    full_name: string
    str_lhorario: string
}

// Variables globales por reporte
const titleReport = `Reporte de marcación de limpieza`
const headerTableReport: Array<RowInput> = [['Personal', 'Horas']]

/**
 * Preprocesa la información, para ser mostrada en PDF
 * @param lData 
 * @param result 
 */
const prettyDataList = (lData: Array<dataList>, result: Array<RowInput>) => {
    lData.forEach(el => {
        let _row = []
        _row.push(el.full_name)
        if ( el.str_lhorario ) {
            let _lhoras = el.str_lhorario.split('|')
            let _totalDiff = 0
            _lhoras.forEach(el => {
                let [dstart, dend] = el.split('TO')
                _totalDiff += ((Date.parse(dend) - Date.parse(dstart))/1000)
            })
            _row.push(`${Math.floor(_totalDiff/3600).toFixed()}h, ${Math.floor((_totalDiff/60) % 60).toFixed()}min`)
        } else _row.push(`0h, 0min`)
        result.push(_row)
    })
}


const MarcacionReport = ( props: propsInput ) => {

    const { lData, dateStart, dateEnd} = props

    const generatePdf = () => {
        const _doc = new jsPDF()
        _doc.setProperties({
            title: 'ReporteMarcacionLimpieza'
        })
        
        let _imgData = `data:image/png;base64,${LOGO_MCH_B64}`

        let _dataListReport: Array<RowInput> = []
        prettyDataList(lData, _dataListReport)

        _doc.addImage(_imgData,148,10,45,20)
        _doc.setFontSize(14)
        _doc.text(`${titleReport}`, MARGINS_REPORT.left + 50, MARGINS_REPORT.top);
        _doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
        _doc.text(`Fecha:`, MARGINS_REPORT.left, MARGINS_REPORT.top + 8)
        _doc.setFont(_doc.getFont().fontName, 'normal')
        _doc.text(`${UtilCustomInstance.toFormatSanDiego(dateStart).fecha} a ${UtilCustomInstance.toFormatSanDiego(dateEnd).fecha}`, MARGINS_REPORT.left + 13, MARGINS_REPORT.top + 8)

        autoTable(_doc, {
            head: [ ...headerTableReport ],
            body: [ ..._dataListReport ],
            margin: { top: MARGINS_REPORT.top + 15, left: MARGINS_REPORT.left },
            tableWidth: 170,
            headStyles: {
                fillColor: '#0077BD'
            }
        })
        _doc.output("dataurlnewwindow")
    }
    
    return (
        <div className="w-full flex text-sm">
            <button title={'Vizualizar pdf'} 
                    onClick={generatePdf} 
                    className={`    display-icon-error
                                    bg-[#0077bd] 
                                    text-white 
                                    py-2
                                    px-3 
                                    text-lg 
                                    border 
                                    border-blue 
                                    rounded-full 
                                    hover:bg-white 
                                    hover:text-blue-800 
                                    duration-300`} 
                    type='button'>
                <AiOutlineFilePdf title='PDF' size={'1.2rem'} /> <span style={{fontSize: 15}} className="text-sm">&nbsp;Ver documento</span>
            </button>
    </div>
    )
}

export default MarcacionReport