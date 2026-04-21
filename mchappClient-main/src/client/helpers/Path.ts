import { path, PathList, rolenum } from '@/client/types/globalTypes'

let test:rolenum = ''

export const PATH: PathList = {
    '/': new path('oficina', 'superadmin'),
    '/rrhh': new path('rrhh','admin','superadmin'),
    '/admin': new path('admin', 'superadmin'),
    '/superadmin': new path('superadmin'),
    '/propietario': new path('propietario'),
    '/dn':new path('dn','superadmin'),
    '/ceo':new path('ceo'),
    '/dnmaster':new path('dnmaster'),
    '/rmg':new path('rmg'),
    '/da': new path('da'),
    '/crm': new path('crm'),
    '/ade': new path('ade'),
    '/colaborador': new path('colaborador'),
    'crmmaster': new path('crmmaster'),
    'aticmaster': new path('aticmaster'),
    'rmgmaster': new path('rmgmaster'),
    'damaster': new path('damaster'),
    'ademaster': new path('ademaster')
}