import * as dotenv from "dotenv";
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TSMigrationGenerator } from "@mikro-orm/migrations";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

dotenv.config();

const options: Options<PostgreSqlDriver> = {
  type: "postgresql",
  metadataProvider: TsMorphMetadataProvider,
  entities: ["dist/home-task-7/entities/**/*.js"], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ["src/home-task-7/entities/**/*.ts"], // path to our TS entities (source), relative to `baseDir`
  cache: {
    options: {
      cacheDir: "cache/home-task-7",
    },
  },
  migrations: {
    tableName: "node_gmp_migrations",
    path: "dist/home-task-7/migrations", // path to the folder with migrations
    pathTs: "src/home-task-7/migrations", // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: "ts", // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
  seeder: {
    path: "dist/home-task-7/seeders", // path to the folder with seeders
    pathTs: "src/home-task-7/seeders", // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: "DatabaseSeeder", // default seeder class name
    glob: "!(*.d).{js,ts}", // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: "ts", // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
};

export default options;
