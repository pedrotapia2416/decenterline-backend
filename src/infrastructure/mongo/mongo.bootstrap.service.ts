import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongoIndustryRepository } from './mongo-industry.repository';
import { MongoRoleRepository } from './mongo-role.repository';
import { MongoUserRepository } from './mongo-user.repository';
import { ScryptPasswordHasherService } from './scrypt-password-hasher.service';

@Injectable()
export class MongoBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly mongoService: MongoService,
    private readonly roleRepository: MongoRoleRepository,
    private readonly userRepository: MongoUserRepository,
    private readonly industryRepository: MongoIndustryRepository,
    private readonly passwordHasher: ScryptPasswordHasherService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.ensureIndexes();
    await this.ensureRoles();
    await this.ensureIndustries();
    await this.ensureBootstrapUser();
  }

  private async ensureIndexes(): Promise<void> {
    const db = this.mongoService.getDb();
    await Promise.all([
      db.collection('users').createIndex({ username: 1 }, { unique: true }),
      db.collection('roles').createIndex({ name: 1 }, { unique: true }),
      db.collection('industries').createIndex({ slug: 1 }, { unique: true }),
      db.collection('industries').createIndex({ active: 1, order: 1 }),
    ]);
  }

  private async ensureRoles(): Promise<void> {
    const now = new Date().toISOString();

    await this.roleRepository.ensureRole({
      name: 'admin',
      description: 'Full access role for internal administration',
      permissions: ['*'],
      createdAt: now,
      updatedAt: now,
    });

    await this.roleRepository.ensureRole({
      name: 'user',
      description: 'Default authenticated user role',
      permissions: ['profile:read'],
      createdAt: now,
      updatedAt: now,
    });
  }

  private async ensureBootstrapUser(): Promise<void> {
    const username = process.env.AUTH_BOOTSTRAP_USERNAME;
    const password = process.env.AUTH_BOOTSTRAP_PASSWORD;
    const rawRoles = process.env.AUTH_BOOTSTRAP_ROLES ?? 'admin';

    if (!username || !password) {
      return;
    }

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      return;
    }

    const roles = rawRoles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);

    const now = new Date().toISOString();
    await this.userRepository.ensureUser({
      username,
      passwordHash: this.passwordHasher.hash(password),
      roles,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  private async ensureIndustries(): Promise<void> {
    const now = new Date().toISOString();
    const industries = [
      {
        slug: 'mineria',
        name: 'Mineria',
        tier: 'Tier 1',
        summary: 'Operaciones de alto presupuesto donde seguridad, contratistas y auditorias definen el negocio.',
        description:
          'La mineria necesita controlar procesos criticos, documentacion, permisos, capacitaciones e inspecciones con trazabilidad completa. Una demo visual clara permite mostrar impacto operativo desde el primer contacto.',
        imageUrl: '/media/industries/mineria.jpg',
        problems: ['Contratistas', 'Seguridad', 'Documentacion', 'Auditorias', 'Capacitacion'],
        products: [
          'Control de contratistas',
          'Permisos de trabajo',
          'Seguridad y evacuacion',
          'Gestion documental',
          'Control de capacitacion',
          'Inspecciones digitales',
          'Gemelo digital operacional',
        ],
        active: true,
        order: 10,
      },
      {
        slug: 'energia',
        name: 'Energia',
        tier: 'Tier 1',
        summary: 'Cooperativas, distribuidoras, parques solares, eolicos y generadoras con activos distribuidos.',
        description:
          'El sector energia requiere seguimiento de cuadrillas, activos, inspecciones, mantenimiento y reportes regulatorios. La digitalizacion reduce friccion operativa y mejora la respuesta ante incidentes.',
        imageUrl: '/media/industries/energia.jpg',
        problems: ['Cuadrillas', 'Inspecciones', 'Mantenimiento', 'Activos', 'Reportes regulatorios'],
        products: ['Gestion de inspecciones', 'Gestion de cuadrillas', 'Control de mantenimiento', 'Reportes regulatorios'],
        active: true,
        order: 20,
      },
      {
        slug: 'construccion',
        name: 'Construccion',
        tier: 'Tier 1',
        summary: 'Obras, contratistas, certificados, seguridad y avances que todavia suelen depender de Excel.',
        description:
          'Construccion combina documentacion, avance fisico, control de acceso, permisos y seguridad. Un tablero operativo permite ordenar la obra y reducir riesgos administrativos.',
        imageUrl: '/media/industries/construccion.jpg',
        problems: ['Contratistas', 'Certificados', 'Seguridad', 'Avances de obra'],
        products: ['Control documental', 'Dashboard de obra', 'Control de acceso', 'Permisos de trabajo'],
        active: true,
        order: 30,
      },
      {
        slug: 'logistica',
        name: 'Logistica',
        tier: 'Tier 2',
        summary: 'Flotas, entregas, centros de distribucion, alertas y KPIs con alto potencial visual.',
        description:
          'Logistica permite demos potentes con mapas, camiones, alertas, entregas y rendimiento operativo. Es ideal para mostrar valor rapido mediante trazabilidad y control en tiempo real.',
        imageUrl: '/media/industries/logistica.png',
        problems: ['Seguimiento de flota', 'Entregas', 'Centros de distribucion', 'KPIs'],
        products: ['Mapa operativo', 'Seguimiento de flota', 'Alertas de entrega', 'KPIs logisticos'],
        active: true,
        order: 40,
      },
      {
        slug: 'agro',
        name: 'Agro',
        tier: 'Tier 2',
        summary: 'Lotes, maquinaria, aplicaciones, personal y mantenimiento para operaciones agroindustriales.',
        description:
          'El agro necesita integrar informacion de campo, maquinaria, personal, trazabilidad y mantenimiento. Los mapas y datos satelitales abren la puerta a tableros de decision muy visuales.',
        imageUrl: '/media/industries/agro.png',
        problems: ['Lotes', 'Maquinaria', 'Aplicaciones', 'Personal', 'Mantenimiento'],
        products: ['Dashboard agricola', 'Trazabilidad', 'Gestion de maquinaria', 'Mantenimiento'],
        active: true,
        order: 50,
      },
      {
        slug: 'turismo',
        name: 'Turismo',
        tier: 'Tier 2',
        summary: 'Hoteles, excursiones y destinos inteligentes con ciclos comerciales mas rapidos.',
        description:
          'Turismo tiene tickets mas contenidos, pero permite vender rapido soluciones para operacion hotelera, experiencias, reservas, excursiones y gestion de destinos.',
        imageUrl: '/media/industries/turismo.png',
        problems: ['Operacion hotelera', 'Excursiones', 'Experiencia del visitante', 'Destinos inteligentes'],
        products: ['Operacion hotelera', 'Gestion de excursiones', 'Destinos inteligentes'],
        active: true,
        order: 60,
      },
      {
        slug: 'sector-publico',
        name: 'Sector Publico',
        tier: 'Tier 3',
        summary: 'GovTech, transparencia, fiscalizacion y procesos administrativos con baja competencia especializada.',
        description:
          'El sector publico requiere entender normativa, procesos administrativos, fiscalizacion, habilitaciones y obras. Las ventas son mas lentas, pero la especializacion genera barreras de entrada.',
        imageUrl: '/media/industries/sector-publico.png',
        problems: ['Procesos administrativos', 'Fiscalizacion', 'Habilitaciones', 'Obras publicas', 'Espacio publico'],
        products: [
          'Gestion documental',
          'Fiscalizacion',
          'Inspecciones',
          'Espacio publico',
          'Cuidacoches',
          'Habilitaciones',
          'Obras publicas',
        ],
        active: true,
        order: 70,
      },
    ];

    await Promise.all(
      industries.map((industry) =>
        this.industryRepository.ensureIndustry({
          ...industry,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );
  }
}
