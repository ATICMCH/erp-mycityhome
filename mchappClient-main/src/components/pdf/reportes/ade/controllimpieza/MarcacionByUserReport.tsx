import React from "react"
import { jsPDF } from "jspdf"
import autoTable, { RowInput } from 'jspdf-autotable'
import UtilCustomInstance from "@/client/helpers/UtilCustom"
import { LOGO_MCH_B64, MARGINS_REPORT } from "@/client/helpers/constants"
import { AiOutlineFilePdf } from "react-icons/ai"

type propsInput = {
    lData: Array<dataList>,
    dateStart: string,
    dateEnd: string,
    persona: string
}

type dataList = {
    idusuario: number
    full_name: string
    etiqueta_piso: string
    fecha: string,
    entrada: string,
    salida: string,
    h_entrada: string,
    h_salida: string
}

// Variables globales por reporte
const titleReport = `Reporte de marcación de limpieza`
const headerTableReport: Array<RowInput> = [['Piso', 'Fecha', 'Entrada', 'Salida', 'Horas']]

/**
 * Preprocesa la información, para ser mostrada en PDF
 * @param lData 
 * @param result 
 */
const prettyDataList = (lData: Array<dataList>, result: Array<RowInput>): string => {
    let _totalDiff = 0
    lData.forEach(el => {
        let _row = []
        _row.push(el.etiqueta_piso)
        _row.push(el.fecha)
        _row.push(el.h_entrada)
        _row.push(el.h_salida)
        if ( el.h_entrada && el.h_salida ) {
            let _diffRow = ((Date.parse(el.salida) - Date.parse(el.entrada))/1000) || 0
            _totalDiff += _diffRow
            _row.push(`${Math.floor(_diffRow/3600).toFixed()}h, ${Math.floor((_diffRow/60) % 60).toFixed()}min`)
        } else _row.push(`0h, 0min`)
        result.push(_row)
    })
    return _totalDiff !== 0 ? `${Math.floor(_totalDiff/3600).toFixed()}h, ${Math.floor((_totalDiff/60) % 60).toFixed()}min` : `0h, 0min`
}


const MarcacionByUserReport = ( props: propsInput ) => {

    const { lData, dateStart, dateEnd, persona} = props

    const generatePdf = () => {
        const _doc = new jsPDF()
        _doc.setProperties({
            title: 'ReporteMarcacionLimpieza'
        })
        const _pageSize = _doc.internal.pageSize

        let _imgData = `data:image/png;base64,${LOGO_MCH_B64}`

        let _dataListReport: Array<RowInput> = []
        const _strTotal = prettyDataList(lData, _dataListReport)

        // _doc.addImage(_imgData,148,10,45,20)
        // _doc.setFontSize(14)
        // _doc.text(`${titleReport}`, MARGINS_REPORT.left + 50, MARGINS_REPORT.top);
        // _doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
        // _doc.text(`Fecha:`, MARGINS_REPORT.left, MARGINS_REPORT.top + 8)
        // _doc.setFont(_doc.getFont().fontName, 'normal')
        // _doc.text(`${UtilCustomInstance.toFormatSanDiego(dateStart).fecha} a ${UtilCustomInstance.toFormatSanDiego(dateEnd).fecha}`, MARGINS_REPORT.left + 13, MARGINS_REPORT.top + 8)

        autoTable(_doc, {
            head: [ ...headerTableReport ],
            body: [ ..._dataListReport ],
            margin: { top: MARGINS_REPORT.top + 14, left: MARGINS_REPORT.left },
            tableWidth: 170,
            headStyles: {
                fillColor: '#0077BD'
            },
            didDrawPage: (data) => {
                // Header
                _doc.addImage(_imgData,148,10,45,20)
                _doc.setFontSize(14)
                _doc.text(`${titleReport}`, MARGINS_REPORT.left + 50, MARGINS_REPORT.top - 10);
                _doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
                _doc.text(`Fecha:`, MARGINS_REPORT.left, MARGINS_REPORT.top)
                _doc.setFont(_doc.getFont().fontName, 'normal')
                _doc.text(`${UtilCustomInstance.toFormatSanDiego(dateStart).fecha} a ${UtilCustomInstance.toFormatSanDiego(dateEnd).fecha}`, MARGINS_REPORT.left + 13, MARGINS_REPORT.top)
                _doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
                _doc.text(`Persona:`, MARGINS_REPORT.left, MARGINS_REPORT.top + 7)
                _doc.setFont(_doc.getFont().fontName, 'normal')
                _doc.text(`${persona}`, MARGINS_REPORT.left + 18, MARGINS_REPORT.top + 7)
                // Fin Header

                // Footer
                let _str = "Page " + _doc.getNumberOfPages()
                _doc.setFontSize(10)
                let _pageHeight = _pageSize.height ? _pageSize.height : _pageSize.getHeight()
                let _pageWidth = _pageSize.width ? _pageSize.width : _pageSize.getWidth()
                _doc.text(`${_str}`, _pageWidth - 30, _pageHeight - 10)
            }
        })

        let _finalY = (_doc as any).lastAutoTable.finalY
        const _pageWidth = _pageSize.width ? _pageSize.width : _pageSize.getWidth()

        _doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
        _doc.text(`Total: `, _pageWidth - 50, _finalY + 10)
        _doc.setFont(_doc.getFont().fontName, 'normal')
        _doc.text(`${_strTotal}`, _pageWidth - 50 + 12, _finalY + 10)

        // Footer
        // const str = "Page " + _doc.getNumberOfPages()
        // _doc.setFontSize(10)
        // const _pageHeight = _pageSize.height ? _pageSize.height : _pageSize.getHeight()
        // _doc.text(`${str}`, MARGINS_REPORT.left, _pageHeight - 10)

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

export default MarcacionByUserReport