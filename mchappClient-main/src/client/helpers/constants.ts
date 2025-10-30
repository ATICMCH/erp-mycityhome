import { AccesoDirectoType, MenuLeftType, rolenum, tAlert } from "../types/globalTypes"


export const ACTION_GO_BACK_LEAD = 'go_back_lead'

// MSG
export const MSG_TABLE_LOADING = 'Cargando...'
export const MSG_TABLE_EMPTY = 'No hay resultados que mostrar!!'
export const MSG_ERROR_SAVE = 'Error, no se puede guardar la información, intentelo más tarde!!'
export const MSG_ERROR_FIELD = 'Error, campos incorrectos:'

// MSG ALERTS
export const ALERT_MSG_SAVE_DATA = 'La información ha sido registrada exitosamente!'
export const ALERT_MSG_CONFIR_DELETE_DATA = '¿Está seguro de eliminar el registro?'
export const ALERT_MSG_CONTRATAR_DELETE_DATA = '¿Está seguro de ejecutar la contratación?'
export const ALERT_MSG_MOVER_LEADS = '¿Está seguro de mover los leads?'
export const ALERT_MSG_CONFIR_RESET_PASSWORD = `¿Está seguro de resetear el password?`
export const ALERT_MSG_RESET_PASSWORD_OK = `El password ha sido reseteado exitosamente!`

export const ADMIN_USERS_PATH = '/api/admin/users'
export const RRHH_USERS_PATH = '/api/rrhh/users'
export const SHARE_PROFILE_PATH = '/api/share/profile'
export const AUTH_LOGIN_PATH = '/api/auth/login'

// Ends points DN
export const DN_APARTMENT_PATH = '/api/dn/apartments/'
export const DN_USERS_PATH = '/api/dn/users/' // propietarios
export const DN_ALL_APARTMENTS_BY_USER_PATH = '/api/propietario/users/'
export const DN_RESPONSABLES_PATH = '/api/dn/leads/responsables/'
export const DN_GET_USERS_RESP_APP = '/api/dn/users/responsables/'
export const DN_LEAD_PATH = '/api/share/leads/'
export const DN_MY_LEADS_PATH = '/api/dn/leads/myleads/'
export const DN_GET_TYPE_RESPONSABLE_PATH = '/api/share/tiporesponsable/'
export const DN_GET_TYPE_AVANCE_PATH = '/api/share/tipoavance/'
export const DN_GET_TYPE_INTERESA_PATH = '/api/share/tipointeresa/'
export const DN_GET_TYPE_OCUPACION_PATH = '/api/share/tipoocupacion/'
export const DN_GET_TYPE_CATEGORIA_PATH = '/api/share/categoria/'
export const DN_NRO_LEAD_PATH = '/api/share/data/totaldata/'
export const DN_MOVER_LEADS_PATH = '/api/share/data/moverleads/'

// share
export const SHARE_PISOS_PATH = '/api/share/apartments/'
export const SHARE_PLATAFORMA_PATH = '/api/share/plataformacomercial/'
export const SHARE_TIPOESTANCIA_PATH = '/api/share/tipoestancia/'
export const SHARE_GET_PROPIETARIOS_PATH = '/api/share/users/propietarios/'

// rmg
export const RMG_APARTMENT_PATH = '/api/rmg/apartments/'
export const RMG_INFOCOMERCIAL_PATH = '/api/rmg/infocomercial/'

// da
export const DA_APARTMENT_PATH = '/api/da/apartments/'

// EndsPoints superadmin
export const SA_ROLES_PATH = '/api/share/roles/'


export const NO_SELECTED = { key: '-2', name: 'Seleccionar' }

// Reports
export const MARGINS_REPORT = {
    top: 45,
    bottom: 60,
    left: 20,
    width: 440
}

export const LOGO_MCH_B64 = `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`
export const CROSS_REPORT = `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`
export const CHECK_REPORT = `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`

// Fin constants report

// Constants for apartments form
export const COUNTRIES = [
    { key: 'España', name: 'España' },
    { key: 'Portugal', name: 'Portugal' },
    { key: 'Francia', name: 'Francia' },
    { key: 'Italia', name: 'Italia' }
]

export const CITIES = [
    { key: 'Madrid', name: 'Madrid' },
    { key: 'Leganes', name: 'Leganés' },
    { key: 'Marbella', name: 'Marbella' },
    { key: 'Barcelona', name: 'Barcelona' },
    { key: 'Retiro', name: 'Retiro' },
    { key: 'Chamartín', name: 'Chamartín' },
    { key: 'Homes Marbella', name: 'Homes Marbella' },
    { key: 'Chamberí', name: 'Chamberí' },
    { key: 'Salamanca', name: 'Salamanca' },
    { key: 'Tetuán', name: 'Tetuán' },
    { key: 'Centro', name: 'Centro' },
    { key: 'Arganzuela', name: 'Arganzuela' }
]

export const STATES = [
    { key: '1', name: 'Alta' },
    { key: '0', name: 'Baja' }
]

export const USER_DEPARMENT = [
    { key: 'ATIC', name: 'ATIC' },
    { key: 'DA', name: 'DA' },
    { key: 'DN', name: 'DN' },
    { key: 'RRHH', name: 'RRHH' },
    { key: 'RMG', name: 'RMG' },
    { key: 'ADE', name: 'ADE' },
    { key: 'CRM', name: 'CRM' }
]

export const STATES_BOOLEAN = [
    { key: 'true', name: 'Si' },
    { key: 'false', name: 'No' }
]

export const TYPE_LEAD_RESPONSABLE = [
    { key: 'Todos', name: 'Todos' },
    { key: 'Colaborador', name: 'Prescriptor' },
    { key: 'Propietario', name: 'Propietario' }
]

export const TIPO_LLAVE = [
    { key: 'Maestra', name: 'Maestra' },
    { key: 'Normal', name: 'Normal' }
]

export const ESTADO_LLAVE = [
    { key: '1', name: 'Activa' },
    { key: '0', name: 'Inactiva' }
]

export const STATES_ADMIN = [
    { key: '-1', name: 'Eliminado' },
    { key: '1', name: 'Alta' },
    { key: '0', name: 'Baja' }
]

export const STATES_PISO_COMERCIAL = [
    { key: '1', name: 'Activo' },
    { key: '3', name: 'No disponible' },
    { key: '2', name: 'Stop Sell' },
]

export const STATES_APLICA_COMERCIAL = [
    { key: 'Ahora', name: 'Ahora' },
    { key: 'Despues', name: 'Despues' },
]

export const STATES_ESTADO_RMG_COMERCIAL = [
    { key: '2', name: 'Activo' },
    { key: '7', name: 'Pendiente' },
]

export const TIPO_PISO = [
    { key: 'Oficina', name: 'Oficina' },
    { key: 'Piso', name: 'Piso' }
]

export const TIPO_LEADS = [
    { key: 'Colaborador', name: 'Prescriptor' },
    { key: 'Propietario', name: 'Propietario' }
]

export const ALERT_INFO: tAlert = 'info'
export const ALERT_DANGER: tAlert = 'danger'
export const ALERT_SUCCESS: tAlert = 'success'
export const ALERT_WARNING: tAlert = 'warning'
export const ALERT_DARK: tAlert = 'dark'

// Menu lateral roles
export const menu_dn: Array<MenuLeftType> = [
    { key: 'dn_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/dn', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/dn/office', codeIcon: 'office' },
    { key: 'dn_users', isActive: false, propID: 'Usuarios', order: 3, menuPath: '/dn/users/', codeIcon: 'user' },
    { key: 'dn_apartments', isActive: false, propID: 'Pisos', order: 4, menuPath: '/dn/apartments/', codeIcon: 'apartment' },
    { key: 'dn_myleads', isActive: false, propID: 'Mis Leads', order: 6, menuPath: '/dn/myleads', codeIcon: 'na' },
    { key: 'dn_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/dn/solicitudes', codeIcon: 'solicitudes' },

]

// Menu lateral dn_aster
export const menu_dn_master: Array<MenuLeftType> = [
    { key: 'dn_master_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/dnmaster', codeIcon: 'home' },
    // { key: 'dn_master_settings', isActive: false, propID: 'Perfiles', order: 2, menuPath: '/dnmaster/settings/responsables', codeIcon: 'perfil' },
    { key: 'dn_master_perfil', isActive: false, propID: 'Perfiles', order: 2, menuPath: '/dnmaster/perfiles', codeIcon: 'perfil' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/dn/office', codeIcon: 'office' },
    { key: 'dn_master_sucess_prescriptor', isActive: false, propID: 'Prescriptores', order: 3, menuPath: '/dnmaster/grupo/prescriptores', codeIcon: 'prescriptor' },
    { key: 'dn_master_sucess_propietario', isActive: false, propID: 'Propietarios', order: 4, menuPath: '/dnmaster/grupo/propietarios', codeIcon: 'propietario' },
    // { key: 'dn_master_apartments', isActive: false, propID: 'Pisos', order: 4, menuPath: '/dnmaster/apartments/', codeIcon: 'apartment' },
    // { key: 'dn_master_myleads', isActive: false, propID: 'Mis Leads', order: 5, menuPath: '/dnmaster/myleads', codeIcon: 'na' },
    { key: 'dn_master_myleads', isActive: false, propID: 'Mis Leads', order: 5, menuPath: '/dnmaster/myleads', codeIcon: 'na' },
    // { key: 'dn_master_moverleads', isActive: false, propID: 'Mover L.', order: 4, menuPath: '/dnmaster/settings/moverleads', codeIcon: 'na' },
    // { key: 'dn_master_leads', isActive: false, propID: 'All Leads', order: 6, menuPath: '/dnmaster/settings/leads', codeIcon: 'leads' },
    { key: 'dn_master_leads_t', isActive: false, propID: 'All Leads', order: 6, menuPath: '/dnmaster/leads', codeIcon: 'leads' },
    { key: 'dn_master_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/dnmaster/solicitudes', codeIcon: 'solicitudes' },


]

// Menu lateral ceo
export const menu_ceo: Array<MenuLeftType> = [
    { key: 'ceo_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/ceo', codeIcon: 'home' },
    { key: 'ceo_apartments', isActive: false, propID: 'Pisos', order: 2, menuPath: '/ceo/apartments', codeIcon: 'apartment' },
    // { key: 'ceo_myleads', isActive: false, propID: 'Mis Leads', order: 3, menuPath: '/ceo/myleads', codeIcon: 'home' },
]

export const menu_rrhh: Array<MenuLeftType> = [
    { key: 'rrhh_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rrhh', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/rrhh/office', codeIcon: 'office' },
    { key: 'rrhh_users', isActive: false, propID: 'Usuarios', order: 3, menuPath: '/rrhh/users/', codeIcon: 'home' },
    { key: 'rrhh_apartments', isActive: false, propID: 'Pisos', order: 4, menuPath: '/rrhh/apartments', codeIcon: 'apartment' },
    { key: 'rrhh_contactos_universidad', isActive: false, propID: 'Universidades', order: 5, menuPath: '/rrhh/contactos-universidad', codeIcon: 'user' },
    { key: 'rrhh_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/rrhh/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_rrhh_master: Array<MenuLeftType> = [
    { key: 'rrhh_master_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rrhhmaster', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/rrhhmaster/office', codeIcon: 'office' },
    { key: 'rrhh_master_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/rrhhmaster/apartments', codeIcon: 'apartment' },
    { key: 'rrhh_master_users', isActive: false, propID: 'Usuarios', order: 4, menuPath: '/rrhhmaster/users/', codeIcon: 'user' },
    { key: 'rrhh_master_contactos_universidad', isActive: false, propID: 'Universidades', order: 5, menuPath: '/rrhhmaster/contactos-universidad', codeIcon: 'user' },
    // { key: 'rrhh_master_users_t', isActive: false, propID: 'Usuarios test', order: 4, menuPath: '/rrhhmaster/tusers/', codeIcon: 'user' },
    //{ key: 'rrhh_master_sucess_prescriptor', isActive: false, propID: 'Prescriptores', order: 5, menuPath: '/rrhhmaster/grupo/prescriptores', codeIcon: 'prescriptor' },
    //{ key: 'rrhh_master_sucess_propietario', isActive: false, propID: 'Propietarios', order: 6, menuPath: '/rrhhmaster/grupo/propietarios', codeIcon: 'propietario' },
    //{ key: 'rrhh_master_myleads', isActive: false, propID: 'Mis Leads', order: 7, menuPath: '/rrhhmaster/myleads', codeIcon: 'na' },
    //{ key: 'rrhh_master_leads', isActive: false, propID: 'All Leads', order: 8, menuPath: '/rrhhmaster/leads', codeIcon: 'leads' },
    { key: 'rrhh_master_fichaje', isActive: false, propID: 'Fichaje', order: 9, menuPath: '/rrhhmaster/fichaje', codeIcon: 'fichaje' },
    { key: 'rrhh_master_esquema', isActive: false, propID: 'Esquema', order: 10, menuPath: '/rrhhmaster/esquema', codeIcon: 'esquema' },
    { key: 'rrhh_master_vacaciones', isActive: false, propID: 'Vacaciones', order: 10, menuPath: '/rrhhmaster/vacaciones', codeIcon: 'vacaciones' },
    { key: 'rrhh_master_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/rrhhmaster/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_superadmin: Array<MenuLeftType> = [
    { key: 'superadmin_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/superadmin', codeIcon: 'home' },
    { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/superadmin/office', codeIcon: 'office' },
    { key: 'superadmin_users', isActive: false, propID: 'Usuarios', order: 3, menuPath: '/superadmin/users/', codeIcon: 'user' },
]

export const menu_propietario: Array<MenuLeftType> = [
    { key: 'propietario_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/propietario', codeIcon: 'home' },
]

export const menu_crm: Array<MenuLeftType> = [
    { key: 'crm_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/crm', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/crm/office', codeIcon: 'office' },
    // { key: 'crm_gestion_piso', isActive: false, propID: 'G. Piso', order: 3, menuPath: '/crm/gestionpiso', codeIcon: 'home' },
    { key: 'crm_apartments', isActive: false, propID: 'Pisos', order: 4, menuPath: '/crm/apartments', codeIcon: 'apartment' },
    { key: 'crm_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/crm/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_crm_master: Array<MenuLeftType> = [
    { key: 'crm_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/crmmaster', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/crm/office', codeIcon: 'office' },
    // { key: 'crm_gestion_piso', isActive: false, propID: 'G. Piso', order: 3, menuPath: '/crm/gestionpiso', codeIcon: 'home' },
    { key: 'crm_apartments', isActive: false, propID: 'Pisos', order: 4, menuPath: '/crmmaster/apartments', codeIcon: 'apartment' },
    { key: 'crm_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/crmmaster/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_ade: Array<MenuLeftType> = [
    { key: 'ade_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/ade', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/ade/office', codeIcon: 'office' },
    { key: 'ade_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/ade/apartments', codeIcon: 'apartment' },
    { key: 'ade_controllimpieza', isActive: false, propID: 'Limpieza', order: 4, menuPath: '/ade/controllimpieza', codeIcon: 'limpieza' },
    { key: 'ade_reports', isActive: false, propID: 'Reportes', order: 5, menuPath: '/ade/reports', codeIcon: 'reports' },
    { key: 'ade_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/ade/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_ade_master: Array<MenuLeftType> = [
    { key: 'ade_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/ademaster', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/ade/office', codeIcon: 'office' },
    { key: 'ade_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/ademaster/apartments', codeIcon: 'apartment' },
    { key: 'ade_controllimpieza', isActive: false, propID: 'Limpieza', order: 4, menuPath: '/ademaster/controllimpieza', codeIcon: 'limpieza' },
    { key: 'ade_reports', isActive: false, propID: 'Reportes', order: 5, menuPath: '/ademaster/reports', codeIcon: 'reports' },
    { key: 'ade_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/ademaster/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_atic: Array<MenuLeftType> = [
    { key: 'atic_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/atic', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/atic/office', codeIcon: 'office' },
    { key: 'atic_perfil', isActive: false, propID: 'Perfiles', order: 2, menuPath: '/atic/perfiles', codeIcon: 'perfil' },
    { key: 'atic_devices', isActive: false, propID: 'Devices', order: 3, menuPath: '/atic/devices', codeIcon: 'devices' },
    { key: 'atic_key', isActive: false, propID: 'Llaves', order: 4, menuPath: '/atic/keys', codeIcon: 'key' },
    { key: 'atic_apartments', isActive: false, propID: 'Pisos', order: 5, menuPath: '/atic/apartments', codeIcon: 'apartment' },
    { key: 'atic_reports', isActive: false, propID: 'Reports', order: 6, menuPath: '/atic/reports', codeIcon: 'reports' },
    { key: 'atic_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/atic/solicitudes', codeIcon: 'solicitudes' },
    { key: 'atic_calendario', isActive: false, propID: 'Calendario', order: 8, menuPath: '/atic/calendario', codeIcon: 'calendario' },

]

export const menu_atic_master: Array<MenuLeftType> = [
    { key: 'atic_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/aticmaster', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/atic/office', codeIcon: 'office' },
    { key: 'atic_perfil', isActive: false, propID: 'Perfiles', order: 2, menuPath: '/aticmaster/perfiles', codeIcon: 'perfil' },
    { key: 'atic_devices', isActive: false, propID: 'Devices', order: 3, menuPath: '/aticmaster/devices', codeIcon: 'devices' },
    { key: 'atic_key', isActive: false, propID: 'Llaves', order: 4, menuPath: '/aticmaster/keys', codeIcon: 'key' },
    { key: 'atic_apartments', isActive: false, propID: 'Pisos', order: 5, menuPath: '/aticmaster/apartments', codeIcon: 'apartment' },
    { key: 'atic_reports', isActive: false, propID: 'Reports', order: 6, menuPath: '/aticmaster/reports', codeIcon: 'reports' },
    { key: 'atic_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/aticmaster/solicitudes', codeIcon: 'solicitudes' },
    { key: 'atic_calendario', isActive: false, propID: 'Calendario', order: 8, menuPath: '/aticmaster/calendario', codeIcon: 'calendario' },

]

export const menu_rmg: Array<MenuLeftType> = [
    { key: 'rmg_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rmg', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/rmg/office', codeIcon: 'office' },
    { key: 'rmg_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/rmg/apartments/', codeIcon: 'apartment' },
    { key: 'rmg_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/rmg/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_rmg_master: Array<MenuLeftType> = [
    { key: 'rmg_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rmgmaster', codeIcon: 'home' },
    // { key: 'share_office', isActive: false, propID: 'Oficina', order: 2, menuPath: '/rmg/office', codeIcon: 'office' },
    { key: 'rmg_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/rmgmaster/apartments/', codeIcon: 'apartment' },
    { key: 'rmg_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/rmgmaster/solicitudes', codeIcon: 'solicitudes' },

]

export const menu_da: Array<MenuLeftType> = [
    { key: 'da_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/da', codeIcon: 'home' },
    { key: 'da_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/da/apartments/', codeIcon: 'apartment' },
    { key: 'da_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/da/solicitudes', codeIcon: 'solicitudes' },

    // { key: 'da_inventario', isActive: false, propID: 'Inventario', order: 4, menuPath: '/da/', codeIcon: 'na' },
]

export const menu_da_master: Array<MenuLeftType> = [
    { key: 'da_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/damaster', codeIcon: 'home' },
    { key: 'da_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/damaster/apartments/', codeIcon: 'apartment' },
    { key: 'da_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/damaster/solicitudes', codeIcon: 'solicitudes' },

]  // { key: 'da_inventario', isActive: false, propID: 'Inventario', order: 4, menuPath: '/da/', codeIcon: 'na' },

export const menu_colaborador: Array<MenuLeftType> = [
    { key: 'col_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/colaborador', codeIcon: 'home' },
    { key: 'col_apartments', isActive: false, propID: 'Pisos', order: 3, menuPath: '/colaborador/apartments/', codeIcon: 'apartment' },
]

// Para cada ruta (o patrón de ruta), qué roles pueden ver el PDF
export const pdfVisibility: Record<string, rolenum[]> = {
    '/dnmaster': ['dn', 'superadmin'],
    '/rmg': [""],
    '/ade': [""],
    '/rrhhmaster': [""],
    '/atic': [""],
};

export const acceso_directos: { [x: string]: Array<AccesoDirectoType> } = {
    atic: [
        {
            orden: 1,
            label: 'Inventario ATIC',
            codeIcon: 'inventario',
            link: 'https://docs.google.com/spreadsheets/d/1WX0PJH6kFobXEQti2IPSk2z2MDbLe4ejWr_dn6OgqoU/edit#gid=1838521752'
        },
        {
            orden: 2,
            label: 'Teleco',
            codeIcon: 'telefono', // inventario
            link: 'https://docs.google.com/spreadsheets/d/1gHH85qYIo0qIclXvbC5Kv1S6uDZCtRdDsCfy94WrSlo/edit?gid=420303763#gid=420303763'
        },
        // {
        //     orden:3,
        //     label: 'Diario de abordo',
        //     codeIcon: 'tool',
        //     link: 'https://docs.google.com/spreadsheets/d/12cecywigTKUXEvZxPsmK7-RDCy9M0GHMkCGrcmRhbbg/edit?gid=2138230868#gid=2138230868'
        // },
        // {
        //     orden: 4,
        //     label: 'Gestion Comentarios',
        //     codeIcon: 'book',
        //     link: 'https://docs.google.com/spreadsheets/d/1qB52rJT7B3RXpM_UEiXcSsJOFg4mW1r9exH7Q8xPnBg/edit?gid=1402520405#gid=1402520405'
        // },
        // {
        //     orden: 5,
        //     label: 'Proyectos',
        //     codeIcon: 'r_grafica',
        //     link: 'https://drive.google.com/drive/folders/1pEFwveIaWBFZSuCrJmPAFybcT9gEhui8?usp=drive_link'
        // },
        {
            orden: 6,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1brkDN3qO7Sc-ZIF4A0b1aTOhZosi8lkCQgAqtF4X2Hs/edit?gid=34299226#gid=34299226 '
        },
        {
            orden: 7,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },        {
            orden: 8,
            label: 'GANTT',
            codeIcon: 'tareas',
            link: 'https://docs.google.com/spreadsheets/d/1Kj2WFFij-K_WkI25d3OIJlKKCw0hwqGb80YoXsOZGYo/edit?gid=2143068176#gid=2143068176'
        },
     {
            orden: 9,
            label: 'Registro de llaves',
            codeIcon: 'key',
            link: 'https://www.appsheet.com/start/89331814-d5df-4607-ab1b-af08846e028f?platform=desktop#appName=16321InventarioATIC-3483538-25-03-12&vss=H4sIAAAAAAAAA6WOsQ6CMBRF_-XO_YJuxjAY0QXDYh0qfSSN0BJaVNL0321F40wc33k5996Au6ZH5WVzAz-H37WnGRxB4DQPJMAFttb40XYCTOAo-wWW5aYuKoGIeGFf25MDD2tk_k8zg1ZkvG41jTkpeynhY6V3dhJYDESGfvLy2tF7ajJiTKy1zeRI1WnG6nq3M8VzkEYdrEqBrewcxRfzuk9mWwEAAA==&view=LLAVES'
        },
    {
            orden: 10,
            label: 'Hommy-Bot',
            codeIcon: 'list',
            link: 'https://www.appsheet.com/start/1e6e44df-9d97-45df-b8b9-6865e9bdbe96'
        },
    {
            orden: 11,
            label: 'JAYKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6890e2ed21608191a9fc10822d2f9b55-jaikey-atic'
        },
     {
            orden: 12,
            label: 'PROCE-BOT',
            codeIcon: 'tareas', // qr donde aparece el bot de proce
            link: 'http://185.252.233.57:3000/'
        },
    ],
    aticmaster: [
        {
            orden: 1,
            label: 'Inventario ATIC',
            codeIcon: 'inventario',
            link: 'https://docs.google.com/spreadsheets/d/1WX0PJH6kFobXEQti2IPSk2z2MDbLe4ejWr_dn6OgqoU/edit#gid=1838521752'
        },
        {
            orden: 2,
            label: 'Teleco',
            codeIcon: 'inventario',
            link: 'https://docs.google.com/spreadsheets/d/1gHH85qYIo0qIclXvbC5Kv1S6uDZCtRdDsCfy94WrSlo/edit?gid=420303763#gid=420303763'
        },
        // {
        //     orden:3,
        //     label: 'Diario de abordo',
        //     codeIcon: 'tool',
        //     link: 'https://docs.google.com/spreadsheets/d/12cecywigTKUXEvZxPsmK7-RDCy9M0GHMkCGrcmRhbbg/edit?gid=2138230868#gid=2138230868'
        // },
        // {
        //     orden: 4,
        //     label: 'Gestion Comentarios',
        //     codeIcon: 'book',
        //     link: 'https://docs.google.com/spreadsheets/d/1qB52rJT7B3RXpM_UEiXcSsJOFg4mW1r9exH7Q8xPnBg/edit?gid=1402520405#gid=1402520405'
        // },
        // {
        //     orden: 5,
        //     label: 'Proyectos',
        //     codeIcon: 'r_grafica',
        //     link: 'https://drive.google.com/drive/folders/1pEFwveIaWBFZSuCrJmPAFybcT9gEhui8?usp=drive_link'
        // },
        {
            orden: 6,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1brkDN3qO7Sc-ZIF4A0b1aTOhZosi8lkCQgAqtF4X2Hs/edit?gid=34299226#gid=34299226 '
        },
        {
            orden: 7,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },        {
            orden: 8,
            label: 'GANTT',
            codeIcon: 'tareas',
            link: 'https://docs.google.com/spreadsheets/d/1Kj2WFFij-K_WkI25d3OIJlKKCw0hwqGb80YoXsOZGYo/edit?gid=2143068176#gid=2143068176'
        },
        {
            orden: 9,
            label: 'Registro de llaves',
            codeIcon: 'key',
            link: 'https://www.appsheet.com/start/89331814-d5df-4607-ab1b-af08846e028f?platform=desktop#appName=16321InventarioATIC-3483538-25-03-12&vss=H4sIAAAAAAAAA6WOsQ6CMBRF_-XO_YJuxjAY0QXDYh0qfSSN0BJaVNL0321F40wc33k5996Au6ZH5WVzAz-H37WnGRxB4DQPJMAFttb40XYCTOAo-wWW5aYuKoGIeGFf25MDD2tk_k8zg1ZkvG41jTkpeynhY6V3dhJYDESGfvLy2tF7ajJiTKy1zeRI1WnG6nq3M8VzkEYdrEqBrewcxRfzuk9mWwEAAA==&view=LLAVES'
        },
    {
            orden: 10,
            label: 'Hommy-Bot',
            codeIcon: 'book',
            link: 'https://www.appsheet.com/start/1e6e44df-9d97-45df-b8b9-6865e9bdbe96'
        },
    {
            orden: 11,
            label: 'JAYKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6890e2ed21608191a9fc10822d2f9b55-jaikey-atic'
        },
         {
            orden: 12,
            label: 'PROCE-BOT',
            codeIcon: 'tareas', // qr donde aparece el bot de proce
            link: 'http://185.252.233.57:3000/'
        },
    ],
    da: [
        // {
        //     orden: 1,
        //     label: 'Inventario',
        //     codeIcon: 'inventario',
        //     link: 'https://docs.google.com/spreadsheets/d/1c0DwFNWjOc2zPGWH2EszXc-wR-e2bgm39IigV69niHA/edit#gid=0'
        // },
        {
            orden: 2,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1ka3IcQYC2pYSjjNrL9Yq_2x2jlViwNuuP0u7uPc8A2Q/edit#gid=747393124'
        },
        // {
        //     orden: 3,
        //     label: 'Carpeta Casos',
        //     codeIcon: 'folder',
        //     link: 'https://drive.google.com/drive/folders/0B3y1BU24sMlgR3VweWpZZ2Y1OFE?resourcekey=0-QCFns33zdV0NxUIa3vsJmA'
        // },
        // {
        //     orden: 4,
        //     label: 'Resumen Servicios',
        //     codeIcon: 'file_done',
        //     link: 'https://docs.google.com/spreadsheets/d/1HfKEECgebihMEaZRgJk3axi5i_r3OvRr_4x_c2XLbSc/edit#gid=244064876'
        // },
        // {
        //     orden: 5,
        //     label: 'Visualización de reservas y limpiezas CE',
        //     codeIcon: 'listado',
        //     link: 'https://app.avantio.com/index.php?action=Login&module=Usuarios'
        // },
        // {
        //     orden: 6,
        //     label: 'Formatos tipo y recursos gráficos DA',
        //     codeIcon: 'r_grafica',
        //     link: 'https://drive.google.com/drive/folders/0BwiC4T_-Y7rfOXVJOHNOQ05Rd0k?resourcekey=0-22XfM9vxhSzn5WTVuqqDfg'
        // },
        // {
        //     orden: 7,
        //     label: 'Sucesos RRHH',
        //     codeIcon: 'file_protected',
        //     link: 'https://docs.google.com/forms/d/e/1FAIpQLSfML6SSeCQ90qkDKs3GQAbvoNlJFnK7Koh2KUt_ndbXyxNgFg/viewform'
        // },
        // {
        //     orden: 8,
        //     label: 'Conteo horas mantenimiento',
        //     codeIcon: 'time',
        //     link: 'https://docs.google.com/spreadsheets/d/1o6LPFicpo-6XLa59nTjfW5xJvPYit8Z-NwWxe-fu1Ms/edit#gid=1835775924'
        // },
        {
            orden: 9,
            label: 'Mensajes Tipo para sucesos pisos',
            codeIcon: 'message_two',
            link: 'https://docs.google.com/spreadsheets/d/13LSEgmx3CCb2xCLuVQ2QyT-c5-TBu7Pu/edit#gid=1530796696'
        },
        {
            orden: 11,
            label: 'Mi Diario Abordo',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1oxXIpCoo3VEFqSx01pPvAsMoXaHkRy-n7P4GPwouc9U/edit#gid=2138230868'
        },
        {
            orden: 12,
            label: 'App Pisos',
            codeIcon: 'appWindows', // inventario
            link: 'https://da-pisos.firebaseapp.com/'
        },
        {
            orden: 13,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 14,
            label: 'LUKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891add384f48191a017117790e83756-lukey-da'
        },
    ],
     damaster: [
        // {
        //     orden: 1,
        //     label: 'Inventario',
        //     codeIcon: 'inventario',
        //     link: 'https://docs.google.com/spreadsheets/d/1c0DwFNWjOc2zPGWH2EszXc-wR-e2bgm39IigV69niHA/edit#gid=0'
        // },
        {
            orden: 2,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1ka3IcQYC2pYSjjNrL9Yq_2x2jlViwNuuP0u7uPc8A2Q/edit#gid=747393124'
        },
        // {
        //     orden: 3,
        //     label: 'Carpeta Casos',
        //     codeIcon: 'folder',
        //     link: 'https://drive.google.com/drive/folders/0B3y1BU24sMlgR3VweWpZZ2Y1OFE?resourcekey=0-QCFns33zdV0NxUIa3vsJmA'
        // },
        // {
        //     orden: 4,
        //     label: 'Resumen Servicios',
        //     codeIcon: 'file_done',
        //     link: 'https://docs.google.com/spreadsheets/d/1HfKEECgebihMEaZRgJk3axi5i_r3OvRr_4x_c2XLbSc/edit#gid=244064876'
        // },
        // {
        //     orden: 5,
        //     label: 'Visualización de reservas y limpiezas CE',
        //     codeIcon: 'listado',
        //     link: 'https://app.avantio.com/index.php?action=Login&module=Usuarios'
        // },
        // {
        //     orden: 6,
        //     label: 'Formatos tipo y recursos gráficos DA',
        //     codeIcon: 'r_grafica',
        //     link: 'https://drive.google.com/drive/folders/0BwiC4T_-Y7rfOXVJOHNOQ05Rd0k?resourcekey=0-22XfM9vxhSzn5WTVuqqDfg'
        // },
        // {
        //     orden: 7,
        //     label: 'Sucesos RRHH',
        //     codeIcon: 'file_protected',
        //     link: 'https://docs.google.com/forms/d/e/1FAIpQLSfML6SSeCQ90qkDKs3GQAbvoNlJFnK7Koh2KUt_ndbXyxNgFg/viewform'
        // },
        // {
        //     orden: 8,
        //     label: 'Conteo horas mantenimiento',
        //     codeIcon: 'time',
        //     link: 'https://docs.google.com/spreadsheets/d/1o6LPFicpo-6XLa59nTjfW5xJvPYit8Z-NwWxe-fu1Ms/edit#gid=1835775924'
        // },
        {
            orden: 9,
            label: 'Mensajes Tipo para sucesos pisos',
            codeIcon: 'message_two',
            link: 'https://docs.google.com/spreadsheets/d/13LSEgmx3CCb2xCLuVQ2QyT-c5-TBu7Pu/edit#gid=1530796696'
        },
        {
            orden: 11,
            label: 'Mi Diario Abordo',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1oxXIpCoo3VEFqSx01pPvAsMoXaHkRy-n7P4GPwouc9U/edit#gid=2138230868'
        },
        {
            orden: 12,
            label: 'App Pisos',
            codeIcon: 'inventario',
            link: 'https://da-pisos.firebaseapp.com/'
        },
        {
            orden: 13,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 14,
            label: 'LUKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891add384f48191a017117790e83756-lukey-da'
        },
    ],
    crm: [
        // {
        //     orden: 1,
        //     label: 'Correo',
        //     codeIcon: 'correo',
        //     link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'
        // },
        // {
        //     orden: 2,
        //     label: 'Airbnb',
        //     codeIcon: 'airbnb',
        //     link: 'https://www.airbnb.es/hosting/inbox/folder/all/thread/1661496151/details'
        // },
        // {
        //     orden: 3,
        //     label: 'Booking',
        //     codeIcon: 'booking',
        //     link: 'https://admin.booking.com/hotel/hoteladmin/groups/home/index.html?lang=en&ses=5da28c18888c5b14f0d742daf4b2df42'
        // },
        {
            orden: 4,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1VWJjanqz4_AMhsDAdwh2BAoe9V1OV6L5fSlmuiGd8Ys/edit#gid=46211632'
        },
        {
            orden: 5,
            label: 'Phone & Sell',
            codeIcon: 'euro',
            link: 'https://canales.redsys.es/admincanales-web/indexLoged.jsp?366c24de180eeb5771406993302a37e0946f4ca0d050b8d830008c9c2a7805114854d7146171e471d5ad6b48b22d2343c6d9d8a43ab552a5d5a37079606c38626aee7805606c56a3683c6825987ecaa0ea6910a9533e0ce7&1#/login'
        },
        {
            orden: 6,
            label: 'Resumen Servicios',
            codeIcon: 'file_done',
            link: 'https://docs.google.com/spreadsheets/d/1HfKEECgebihMEaZRgJk3axi5i_r3OvRr_4x_c2XLbSc/edit#gid=244064876'
        },
        {
            orden: 7,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
        {
            orden: 8,
            label: 'Movimientos ADE TPV',
            codeIcon: 'movimientosTPV', // book
            link: 'https://docs.google.com/spreadsheets/d/1-ZINIYK7zZFAUIYAREtZEqfyV9jmzgz4/edit#gid=484005442'
        },
        {
            orden: 9,
            label: 'Movimientos ADE Phone&sell',
            codeIcon: 'phoneSell', // book
            link: 'https://docs.google.com/spreadsheets/d/1-VYfLi6T3q6GcBinFER8c2OfG1A7U7-FWaiYxFa4W8Q/edit#gid=0'
        },
        {
            orden: 10,
            label: 'Historico Reviews e Ingresos',
            codeIcon: 'review', // book
            link: 'https://docs.google.com/spreadsheets/d/1gptuMJQxz3Frlh3PBgXuIX-pcAGp6XKTb1bXr-KKzTE/edit?usp=drive_link'
        },
        {
            orden: 11,
            label: 'Glovo',
            codeIcon: 'glovo',
            link: 'https://laaspartners.glovoapp.com/orders'
        },
        {
            orden: 12,
            label: 'Plantilla servicio',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1ajq6LtJM8Gei8q8Hbms99djEP3POGoKSsNLbINDaM5w/edit?gid=679674893#gid=679674893'
        },
        {
            orden: 13,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
    {
            orden: 14,
            label: 'Registro de llaves',
            codeIcon: 'key',
            link: 'https://www.appsheet.com/start/89331814-d5df-4607-ab1b-af08846e028f?platform=desktop#appName=16321InventarioATIC-3483538-25-03-12&vss=H4sIAAAAAAAAA6WOsQ6CMBRF_-XO_YJuxjAY0QXDYh0qfSSN0BJaVNL0321F40wc33k5996Au6ZH5WVzAz-H37WnGRxB4DQPJMAFttb40XYCTOAo-wWW5aYuKoGIeGFf25MDD2tk_k8zg1ZkvG41jTkpeynhY6V3dhJYDESGfvLy2tF7ajJiTKy1zeRI1WnG6nq3M8VzkEYdrEqBrewcxRfzuk9mWwEAAA==&view=LLAVES'
        },
    {
            orden: 15,
            label: 'Hommy-Bot',
            codeIcon: 'bot',
            link: 'https://www.appsheet.com/start/1e6e44df-9d97-45df-b8b9-6865e9bdbe96'
        },
    {
            orden: 16,
            label: 'NIKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b77ae9e0819188f5237081af4f30-nikey-crm'
        },
    ],
    crmmaster: [
        // {
        //     orden: 1,
        //     label: 'Correo',
        //     codeIcon: 'correo',
        //     link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'
        // },
        // {
        //     orden: 2,
        //     label: 'Airbnb',
        //     codeIcon: 'airbnb',
        //     link: 'https://www.airbnb.es/hosting/inbox/folder/all/thread/1661496151/details'
        // },
        // {
        //     orden: 3,
        //     label: 'Booking',
        //     codeIcon: 'booking',
        //     link: 'https://admin.booking.com/hotel/hoteladmin/groups/home/index.html?lang=en&ses=5da28c18888c5b14f0d742daf4b2df42'
        // },
        {
            orden: 4,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1VWJjanqz4_AMhsDAdwh2BAoe9V1OV6L5fSlmuiGd8Ys/edit#gid=46211632'
        },
        {
            orden: 5,
            label: 'Phone & Sell',
            codeIcon: 'euro',
            link: 'https://canales.redsys.es/admincanales-web/indexLoged.jsp?366c24de180eeb5771406993302a37e0946f4ca0d050b8d830008c9c2a7805114854d7146171e471d5ad6b48b22d2343c6d9d8a43ab552a5d5a37079606c38626aee7805606c56a3683c6825987ecaa0ea6910a9533e0ce7&1#/login'
        },
        {
            orden: 6,
            label: 'Resumen Servicios',
            codeIcon: 'file_done',
            link: 'https://docs.google.com/spreadsheets/d/1HfKEECgebihMEaZRgJk3axi5i_r3OvRr_4x_c2XLbSc/edit#gid=244064876'
        },
        {
            orden: 7,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
        {
            orden: 8,
            label: 'Movimientos ADE TPV',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1-ZINIYK7zZFAUIYAREtZEqfyV9jmzgz4/edit#gid=484005442'
        },
        {
            orden: 9,
            label: 'Movimientos ADE Phone&sell',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1-VYfLi6T3q6GcBinFER8c2OfG1A7U7-FWaiYxFa4W8Q/edit#gid=0'
        },
        {
            orden: 10,
            label: 'Historico Reviews e Ingresos',
            codeIcon: 'review', // book
            link: 'https://docs.google.com/spreadsheets/d/1gptuMJQxz3Frlh3PBgXuIX-pcAGp6XKTb1bXr-KKzTE/edit?usp=drive_link'
        },
        {
            orden: 11,
            label: 'Glovo',
            codeIcon: 'glovo',
            link: 'https://laaspartners.glovoapp.com/orders'
        },
        {
            orden: 12,
            label: 'Plantilla servicio',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1ajq6LtJM8Gei8q8Hbms99djEP3POGoKSsNLbINDaM5w/edit?gid=679674893#gid=679674893'
        },
        {
            orden: 13,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
     {
            orden: 14,
            label: 'Registro de llaves',
            codeIcon: 'key',
            link: 'https://www.appsheet.com/start/89331814-d5df-4607-ab1b-af08846e028f?platform=desktop#appName=16321InventarioATIC-3483538-25-03-12&vss=H4sIAAAAAAAAA6WOsQ6CMBRF_-XO_YJuxjAY0QXDYh0qfSSN0BJaVNL0321F40wc33k5996Au6ZH5WVzAz-H37WnGRxB4DQPJMAFttb40XYCTOAo-wWW5aYuKoGIeGFf25MDD2tk_k8zg1ZkvG41jTkpeynhY6V3dhJYDESGfvLy2tF7ajJiTKy1zeRI1WnG6nq3M8VzkEYdrEqBrewcxRfzuk9mWwEAAA==&view=LLAVES'
        },
    {
            orden: 15,
            label: 'Hommy-Bot',
            codeIcon: 'bot',
            link: 'https://www.appsheet.com/start/1e6e44df-9d97-45df-b8b9-6865e9bdbe96'
        },
    {
            orden: 16,
            label: 'NIKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b77ae9e0819188f5237081af4f30-nikey-crm'
        },
    ],
    rmg: [
        {
            orden: 0,
            label: 'Limite precio',
            codeIcon: 'euro',
            link: '/rmg/limiteprecio'
        },
        // {
        //     orden: 1,
        //     label: 'Listado',
        //     codeIcon: 'list',
        //     link: 'https://docs.google.com/spreadsheets/d/1mvjO_iLZ1Z5otgPXchywGmIUs2jaUn54jqDJYx7oyWQ/edit#gid=484218769'
        // },
        {
            orden: 2,
            label: 'Pricing',
            codeIcon: 'euro',
            link: 'https://docs.google.com/spreadsheets/d/1iNcT9oxtSQVtvDtR6nyB0U7FUNFq5_iPXf6dBrEbzEI/edit#gid=821270918'
        },
        {
            orden: 3,
            label: 'Calendario Pricing',
            codeIcon: 'calendar',
            link: 'https://docs.google.com/spreadsheets/d/14ZLr_1j4uZwNyLf3tPKmKqAp99h4Z8irmpcuuNa56Qg/edit#gid=0'
        },
        {
            orden: 4,
            label: 'Reporte de Ocupación',
            codeIcon: 'excel',
            link: 'https://docs.google.com/spreadsheets/d/1Hh7pzQGFXZj8Tecf7vdeXNH959xH90TOiu7PMzmyMXs/edit'
        },
        {
            orden: 5,
            label: 'Claves & Contacto',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1QqkMfa36qbwAuUqGjoVIiYH-y2AAISz1jDuSv1zLOPM/edit'
        },
        {
            orden: 6,
            label: 'Leads LE',
            codeIcon: 'list',
            link: 'https://docs.google.com/spreadsheets/d/13FoMWDxSYmdi8SFZckp7FXUHLGMvSUNXAppX39pLVls/edit'
        },
        {
            orden: 7,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 8,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
    {
            orden: 9,
            label: 'ZAYKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b47e843c8191bc1757db000d72eb-zaykey-rmg'
        },
    ],
    rmgmaster: [
        {
            orden: 0,
            label: 'Limite precio',
            codeIcon: 'euro',
            link: '/rmg/limiteprecio'
        },
        // {
        //     orden: 1,
        //     label: 'Listado',
        //     codeIcon: 'list',
        //     link: 'https://docs.google.com/spreadsheets/d/1mvjO_iLZ1Z5otgPXchywGmIUs2jaUn54jqDJYx7oyWQ/edit#gid=484218769'
        // },
        {
            orden: 2,
            label: 'Pricing',
            codeIcon: 'euro',
            link: 'https://docs.google.com/spreadsheets/d/1iNcT9oxtSQVtvDtR6nyB0U7FUNFq5_iPXf6dBrEbzEI/edit#gid=821270918'
        },
        {
            orden: 3,
            label: 'Calendario Pricing',
            codeIcon: 'calendar',
            link: 'https://docs.google.com/spreadsheets/d/14ZLr_1j4uZwNyLf3tPKmKqAp99h4Z8irmpcuuNa56Qg/edit#gid=0'
        },
        {
            orden: 4,
            label: 'Reporte de Ocupación',
            codeIcon: 'excel',
            link: 'https://docs.google.com/spreadsheets/d/1Hh7pzQGFXZj8Tecf7vdeXNH959xH90TOiu7PMzmyMXs/edit'
        },
        {
            orden: 5,
            label: 'Claves & Contacto',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1QqkMfa36qbwAuUqGjoVIiYH-y2AAISz1jDuSv1zLOPM/edit'
        },
        {
            orden: 6,
            label: 'Leads LE',
            codeIcon: 'list',
            link: 'https://docs.google.com/spreadsheets/d/13FoMWDxSYmdi8SFZckp7FXUHLGMvSUNXAppX39pLVls/edit'
        },
        {
            orden: 7,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 8,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
    {
            orden: 9,
            label: 'ZAYKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b47e843c8191bc1757db000d72eb-zaykey-rmg'
        },
    ],
    dnmaster: [
        {
            orden: 0,
            label: 'Estadísticas Leads',
            codeIcon: 'estadistica',
            link: '/dnmaster/leads/reports'
        },
        {
            orden: 1,
            label: 'Reunión Propietario',
            codeIcon: 'folder_link',
            link: 'https://drive.google.com/drive/u/0/folders/141xCrlk4fIYDnb2o-G3PucX5uKhpnVhl'
        },
        {
            orden: 2,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1UYcXAS-MI2m0jIMt1bPc3GHtk_wNEJnKeI38NZ7PKik/edit#gid=1094433598'
        },
        {
            orden: 3,
            label: 'Pildoras formativas',
            codeIcon: 'na',
            link: 'https://drive.google.com/drive/folders/19KFKJ37sWT_qiVUQVGCdluLKpqXhG0BG'
        },
        {
            orden: 4,
            label: 'Acuerdo Agentes',
            codeIcon: 'na',
            link: 'https://drive.google.com/drive/folders/1At0Q0Q9oxZ7vWK5emB5CLeQgXa_PUZC8'
        },
        {
            orden: 5,
            label: 'Señal Llaves',
            codeIcon: 'key',
            link: 'https://drive.google.com/drive/folders/1AYgNOVE_bs8LiQ9yos_REir0wJXFrVpS'
        },
        {
            orden: 6,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
    {
            orden: 7,
            label: 'VIKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b59281988191b0a18c1282436e96-vikey-dn'
        },
    ],
    rrhhmaster: [
        {
            orden: 1,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1-HJ963yF6SO7Tp31qZABb_v9951flrAowKzxLIqDlPw/edit#gid=1508133306'
        },        
        {
            orden: 2,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
    {
            orden: 3,
            label: 'FRANKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b801a5d88191b98af563b903e894-frankey'
        },
         {
            orden: 4,
            label: 'PROCE-BOT',
            codeIcon: 'tareas', // qr donde aparece el bot de proce
            link: 'http://185.252.233.57:3000/'
        },
    ],
    rrhh: [
        {
            orden: 1,
            label: 'Claves y Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1-HJ963yF6SO7Tp31qZABb_v9951flrAowKzxLIqDlPw/edit#gid=1508133306'
        },
    {
            orden: 2,
            label: 'FRANKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b801a5d88191b98af563b903e894-frankey'
        },
         {
            orden: 4,
            label: 'PROCE-BOT',
            codeIcon: 'tareas', // qr donde aparece el bot de proce
            link: 'http://185.252.233.57:3000/'
        },
    ],
    ade: [
        {
            orden: 1,
            label: 'P&G',
            codeIcon: 'reporteDinero', // book
            link: 'https://docs.google.com/spreadsheets/d/1PLfPSExa7-5jfq0M-z1arGLF7-JZ93PGbptiUsMn5H4/edit?gid=0#gid=0 '
        },
        {
            orden: 2,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 3,
            label: 'Movimiento cuentas', 
            codeIcon: 'cuenta', // book
            link: 'https://docs.google.com/spreadsheets/d/1YX6Jr50ORgjQEuMgzKyQWKNv2kc8-XOYi3G2oXfZgFI/edit?gid=265500886#gid=265500886'
        },
        {
            orden: 4,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1UTcX_JQRbAPmQCgt4eN7Ak7RQSPjFM6RkD_BGNZOPIk/edit?gid=736158589#gid=736158589'
        },
        {
            orden: 5,
            label: 'Rel. Prop.',
            codeIcon: 'person', //book
            link: 'https://docs.google.com/spreadsheets/d/1HPNhMOcFe54HEcSUyxdBUe_ENJy7uT8er0nGKQNzMu4/edit?gid=672753587#gid=672753587 '
        },
        {
            orden: 6,
            label: 'Gastos Pisos',
            codeIcon: 'gastosPisos', //book
            link: 'https://docs.google.com/spreadsheets/d/1WXWM4WUBjSk_HKRdDDy_lTyBP2AUCZ5jxzznK8U0khQ/edit?gid=0#gid=0'
        },
        {
            orden: 7,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
    {
            orden: 8,
            label: 'BEKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b5ad8230819183432520e5f7fb46-bekey-ade-legal'
        },
    ],
    ademaster: [
        {
            orden: 1,
            label: 'P&G',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1PLfPSExa7-5jfq0M-z1arGLF7-JZ93PGbptiUsMn5H4/edit?gid=0#gid=0 '
        },
        {
            orden: 2,
            label: 'P1N',
            codeIcon: 'alerta',
            link: 'https://docs.google.com/spreadsheets/d/1ZHrC2In_H9NSRzkdo6y9WMVAhwCTLyJ_eF07P2jBZzE/edit?gid=0#gid=0'
        },
        {
            orden: 3,
            label: 'Movimiento cuentas',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1YX6Jr50ORgjQEuMgzKyQWKNv2kc8-XOYi3G2oXfZgFI/edit?gid=265500886#gid=265500886'
        },
        {
            orden: 4,
            label: 'Claves & Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1UTcX_JQRbAPmQCgt4eN7Ak7RQSPjFM6RkD_BGNZOPIk/edit?gid=736158589#gid=736158589'
        },
        {
            orden: 5,
            label: 'Rel. Prop.',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1HPNhMOcFe54HEcSUyxdBUe_ENJy7uT8er0nGKQNzMu4/edit?gid=672753587#gid=672753587 '
        },
        {
            orden: 6,
            label: 'Gastos Pisos',
            codeIcon: 'book',
            link: 'https://docs.google.com/spreadsheets/d/1WXWM4WUBjSk_HKRdDDy_lTyBP2AUCZ5jxzznK8U0khQ/edit?gid=0#gid=0'
        },
        {
            orden: 7,
            label: 'Control Larga estancia',
            codeIcon: 'LE',
            link: 'https://docs.google.com/spreadsheets/d/1rErSMxpuQCtqtHOXo0feuVCcUfL8IW7HqScv2op1QFQ/edit#gid=1129721043'
        },
        {
            orden: 8,
            label: 'BEKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b5ad8230819183432520e5f7fb46-bekey-ade-legal'
        },
    ],
    superadmin: [],
    dn: [
        {
            orden: 0,
            label: 'Estadísticas Leads',
            codeIcon: 'estadistica',
            link: '/dnmaster/leads/reports'
        },
        {
            orden: 1,
            label: 'Reunion Propietario',
            codeIcon: 'folder_link',
            link: 'https://drive.google.com/drive/u/0/folders/141xCrlk4fIYDnb2o-G3PucX5uKhpnVhl'
        },
        {
            orden: 2,
            label: 'Claves y Contactos',
            codeIcon: 'contactos',
            link: 'https://docs.google.com/spreadsheets/d/1UYcXAS-MI2m0jIMt1bPc3GHtk_wNEJnKeI38NZ7PKik/edit#gid=1094433598'
        },
        {
            orden: 3,
            label: 'Pildoras formativas',
            codeIcon: 'na',
            link: 'https://drive.google.com/drive/folders/19KFKJ37sWT_qiVUQVGCdluLKpqXhG0BG'
        },
        {
            orden: 4,
            label: 'Acuerdo Agentes',
            codeIcon: 'na',
            link: 'https://drive.google.com/drive/folders/1At0Q0Q9oxZ7vWK5emB5CLeQgXa_PUZC8'
        },
        {
            orden: 5,
            label: 'Señal Llaves',
            codeIcon: 'key',
            link: 'https://drive.google.com/drive/folders/1AYgNOVE_bs8LiQ9yos_REir0wJXFrVpS'
        },
    {
            orden: 6,
            label: 'VIKEY',
            codeIcon: 'bot',
            link: 'https://chatgpt.com/g/g-6891b59281988191b0a18c1282436e96-vikey-dn'
        },
    ],
    share: [
        // {
        //     orden: -1,
        //     label: 'Avantio',
        //     codeIcon: 'na',
        //     link: 'https://app.avantio.com/index.php?module=Planner&action=index&return_module=Compromisos&return_action=ListViewDisponibilidad'
        // },
        // {
        //     orden: -2,
        //     label: 'Trello',
        //     codeIcon: 'na',
        //     link: 'https://trello.com/b/rd4GvI6z/1crm'
        // },
        /*{
            orden: -3,
            label: 'Guardias',
            codeIcon: 'person',
            link: 'https://docs.google.com/spreadsheets/d/1mm06yZUzij1qSI3aHVH4xwsZmxD1fLzseoAza-pp_cQ/edit#gid=1536278088'
        },*/
        // {
        //     orden: -4,
        //     label: 'Sucesos Pisos',
        //     codeIcon: 'file_user',
        //     link: 'https://docs.google.com/forms/d/e/1FAIpQLScTUZXV2lhuN9gue01OnCqlYNavi_EzhPsYhlcr0c0YUmJMyQ/viewform'
        // },
        // {
        //     orden: -5,
        //     label: 'Whatsapp',
        //     codeIcon: 'whatsapp',
        //     link: 'https://web.whatsapp.com/'
        // },
        // {
        //     orden: -6,
        //     label: 'Vacaciones MCH',
        //     codeIcon: 'calendar',
        //     link: 'https://docs.google.com/spreadsheets/d/1Yu_8vUJs83lHSZtVF2yFPaTCdkd66xqDA6cX2fhjybg/edit#gid=519276748'
        // },
        // {
        //     orden: -7,
        //     label: 'Reunión General',
        //     codeIcon: 'na',
        //     link: 'https://docs.google.com/document/d/1jpu2JHf-Svrla7mBTRWjIyutsDLB7EowSEPYtPp4J-E/edit'
        // },
        // {
        //     orden: -8,
        //     label: 'Herramientas ayuda',
        //     codeIcon: 'herramienta_ayuda',
        //     link: 'https://docs.google.com/spreadsheets/d/1yLU7nMrDNFC0O_ewJQEnxhGGw2IH5_GVzmqN8r2Q3_A/edit#gid=0'
        // }
    ],
    na: []
}
