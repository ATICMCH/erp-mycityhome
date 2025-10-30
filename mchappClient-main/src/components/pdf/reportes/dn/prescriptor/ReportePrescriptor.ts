import React from "react"
import { jsPDF } from "jspdf"            
import autoTable, { RowInput } from 'jspdf-autotable'
import UtilCustomInstance from "@/client/helpers/UtilCustom"
import { LOGO_MCH_B64, MARGINS_REPORT } from "@/client/helpers/constants"
import { AiOutlineFilePdf } from "react-icons/ai"

type propsInput = {
    lData: Array<dataListPrescriptor>,
    dateStart: string,
    dateEnd: string,
    persona: string
}

type dataListPrescriptor = {
    nombre_completo: string
    telefono: string
    email: string
    empresa: string
    idcategoria: string
}

const prettyDataListPrescriptor = (lData: Array<dataListPrescriptor>, result: Array<any>): string => {
    let totalPrescriptores = lData.length;

    lData.forEach(el => {
        let row = [];
        row.push(el.nombre_completo);
        row.push(el.telefono);
        row.push(el.email);
        row.push(el.empresa);
        row.push(el.idcategoria);
        
        result.push(row);
    });

    return `${totalPrescriptores} prescriptores`;
};

const PrescriptorReport = (props: propsInput) => {
    const { lData, dateStart, dateEnd, persona } = props;

    const generatePdf = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: 'ReportePrescriptores'
        });
        
        const headerTableReport = [
            ["Nombre Completo", "Teléfono", "Email", "Empresa", "Categoría"]
        ];
        
        let dataListReport: Array<any> = [];
        const totalPrescriptores = prettyDataListPrescriptor(lData, dataListReport);

        // Encabezado del PDF
        doc.setFontSize(14);
        doc.text('Reporte de Prescriptores', 14, 20);
        doc.setFontSize(11).setFont(doc.getFont().fontName, 'bold');
        doc.text(`Fecha: ${dateStart} a ${dateEnd}`, 14, 30);
        doc.text(`Persona: ${persona}`, 14, 40);

        autoTable(doc, {
            head: headerTableReport,
            body: dataListReport,
            margin: { top: 50 },
            headStyles: {
                fillColor: '#0077BD'
            },
            didDrawPage: (data) => {
                // Footer
                const str = "Página " + doc.getNumberOfPages();
                doc.setFontSize(10);
                const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            }
        })

        // Total de prescriptores
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(11).setFont(doc.getFont().fontName, 'bold')
        doc.text(`Total: ${totalPrescriptores}`, 14, finalY + 10)

        doc.output("dataurlnewwindow")
    }
}

export default PrescriptorReport