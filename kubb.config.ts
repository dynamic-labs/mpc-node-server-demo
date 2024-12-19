import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/swagger-ts';

export default defineConfig({
  root: '.',
  input: {
    path: './openapi/v1/openapi.yaml',
  },
  output: {
    path: './src/generated',
  },
  plugins: [
    pluginOas({ output: false }),
    pluginTs({
      output: {
        path: './types',
      },
      transformers: {
        name: (name) => {
          return `${name}Type`;
        },
      },
    }),
  ],
});
