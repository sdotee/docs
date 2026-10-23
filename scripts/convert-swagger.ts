// Converts the Swagger 2.0 spec exported by the backend (swag) into the
// OpenAPI 3.1 `openapi_swagger.yaml` used by the docs, then applies doc fixes.
// Usage: bun scripts/convert-swagger.ts <swagger2.yaml> [output.yaml]
import { readFileSync, writeFileSync } from 'node:fs';
import { load as parseYaml, dump as dumpYaml } from 'js-yaml';

type Obj = Record<string, any>;

const [input, output = './openapi_swagger.yaml'] = process.argv.slice(2);
if (!input) {
  console.error('Usage: bun scripts/convert-swagger.ts <swagger2.yaml> [output.yaml]');
  process.exit(1);
}

const src = parseYaml(readFileSync(input, 'utf-8')) as Obj;

// Rewrite refs and turn `type: file` into binary strings, recursively
function convertSchema(node: any): any {
  if (Array.isArray(node)) return node.map(convertSchema);
  if (!node || typeof node !== 'object') return node;
  const out: Obj = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '$ref' && typeof v === 'string') {
      out[k] = v.replace('#/definitions/', '#/components/schemas/');
    } else {
      out[k] = convertSchema(v);
    }
  }
  if (out.type === 'file') {
    out.type = 'string';
    out.format = 'binary';
  }
  // swag emits `allOf: [$ref]` to attach a description; 3.1 allows $ref siblings
  if (Array.isArray(out.allOf) && out.allOf.length === 1 && out.allOf[0].$ref) {
    const { allOf, ...siblings } = out;
    return { $ref: allOf[0].$ref, ...siblings };
  }
  return out;
}

// Fields that are copied from a swagger 2 parameter into its schema
const SCHEMA_KEYS = [
  'type', 'format', 'items', 'enum', 'default', 'minimum', 'maximum',
  'minLength', 'maxLength', 'minItems', 'maxItems', 'pattern',
];

function paramSchema(p: Obj): Obj {
  const schema: Obj = {};
  for (const k of SCHEMA_KEYS) if (p[k] !== undefined) schema[k] = p[k];
  return convertSchema(schema);
}

function convertOperation(op: Obj): Obj {
  const { consumes, produces, parameters = [], responses = {}, ...rest } = op;
  const result: Obj = { ...rest, parameters: [] };

  const formFields = parameters.filter((p: Obj) => p.in === 'formData');
  for (const p of parameters) {
    if (p.in === 'body') {
      result.requestBody = {
        content: { 'application/json': { schema: convertSchema(p.schema) } },
        description: p.description,
        required: p.required,
      };
    } else if (p.in !== 'formData') {
      const param: Obj = {
        description: p.description,
        in: p.in,
        name: p.name,
        required: p.required,
        schema: paramSchema(p),
      };
      if (p.collectionFormat === 'csv') {
        param.style = 'form';
        param.explode = false;
      }
      result.parameters.push(param);
    }
  }

  if (formFields.length > 0) {
    const properties: Obj = {};
    for (const p of formFields) {
      properties[p.name] = { ...paramSchema(p), description: p.description };
    }
    const required = formFields.filter((p: Obj) => p.required).map((p: Obj) => p.name);
    result.requestBody = {
      content: {
        'multipart/form-data': {
          schema: { properties, required: required.length ? required : undefined, type: 'object' },
        },
      },
      required: true,
    };
  }

  if (result.parameters.length === 0) delete result.parameters;

  const mediaType = produces?.[0] ?? 'application/json';
  result.responses = {};
  for (const [code, res] of Object.entries<Obj>(responses)) {
    result.responses[code] = res.schema
      ? { content: { [mediaType]: { schema: convertSchema(res.schema) } }, description: res.description }
      : { description: res.description };
  }
  return result;
}

const paths: Obj = {};
for (const [path, item] of Object.entries<Obj>(src.paths ?? {})) {
  paths[path] = {};
  for (const [method, op] of Object.entries<Obj>(item)) {
    paths[path][method] = convertOperation(op);
  }
}

const schemas: Obj = {};
for (const [name, def] of Object.entries(src.definitions ?? {})) {
  schemas[name] = convertSchema(def);
}

const { contact: _contact, ...info } = src.info ?? {};

const doc: Obj = {
  components: {
    schemas,
    securitySchemes: src.securityDefinitions,
  },
  info,
  openapi: '3.1.0',
  paths,
  servers: [{ url: 'https://s.ee' }],
};

// ---------------------------------------------------------------------------
// Doc fixes on top of the raw backend export
// ---------------------------------------------------------------------------

// Some swag comments in the backend are written in Chinese
const descriptionOverrides: Record<string, Record<string, string>> = {
  'model.BioPageStyle': {
    layout: 'Layout type, e.g. "grid" or "list"',
    meta: 'Extended configuration (arbitrary JSON), stored and returned as-is without validation',
    template: 'Template type, e.g. "card" or "minimal"',
    theme_type: 'Theme type, "light" or "dark"',
  },
  'val.CreateQrcodeReq': {
    custom_slug: 'Your preferred custom slug. If not provided, a random slug will be generated.',
    domain: 'The domain to use for the QR code short URL. If not provided, the default domain is used.',
    target_url: 'The destination URL the QR code points to (required)',
    title: 'A descriptive title for this QR code (required)',
  },
  'val.CreateQrcodeResp': {
    custom_slug: 'The custom slug if one was requested',
    pdf_url: 'Download URL of the QR code in PDF format',
    png_url: 'Download URL of the QR code in PNG format',
    short_url: 'The complete short URL encoded in the QR code',
    slug: 'The slug portion of the short URL',
    svg_url: 'Download URL of the QR code in SVG format',
  },
  'val.DeleteQrcodeReq': {
    domain: 'The domain of the QR code short URL (e.g., "s.ee")',
    slug: 'The slug of the QR code short URL to delete',
  },
  'val.CreateTextReq': {
    domain: 'The domain to use for your text sharing URL (e.g., "fs.to")',
  },
  'val.GetUsageResp': {
    text_count_day: 'Text sharings created today',
    text_count_day_limit: 'Maximum text sharings allowed per day',
    text_count_month: 'Text sharings created this month',
    text_count_month_limit: 'Maximum text sharings allowed per month',
  },
  'val.UploadFileRespData': {
    created_at: 'File upload timestamp (for upload history only)',
  },
  'val.GetFileHistoryRespV': {
    data: 'List of uploaded files',
    success: 'Whether the request succeeded',
  },
  'val.GetLinkHistoryRespV': {
    data: 'List of short links',
    success: 'Whether the request succeeded',
  },
  'val.GetTextHistoryRespV': {
    data: 'List of text sharings',
    success: 'Whether the request succeeded',
  },
  'val.QrcodeHistoryData': {
    created_at: 'Unix timestamp when the QR code was created',
    domain: 'The domain used for this QR code short URL',
    pdf_url: 'Download URL of the QR code in PDF format',
    png_url: 'Download URL of the QR code in PNG format',
    scan_count: 'Number of times the QR code has been scanned',
    short_url: 'The complete short URL encoded in the QR code',
    slug: 'The slug portion of the short URL',
    svg_url: 'Download URL of the QR code in SVG format',
    title: 'Title of the QR code',
  },
};
for (const [schema, props] of Object.entries(descriptionOverrides)) {
  for (const [prop, description] of Object.entries(props)) {
    const target = schemas[schema]?.properties?.[prop];
    if (target) target.description = description;
  }
}

// Copy-edited operation descriptions
const operationDescriptions: Record<string, string> = {
  CreateShortUrlSimpleMode:
    'Creates a short URL using query parameters instead of a JSON body. Returns plain text by default; set json=true for a JSON response. This endpoint can be used in bookmarklets and other integrations that send query parameters.',
  CreateShortUrl:
    'Creates a short URL for a destination link. Optional settings include a custom slug, password, expiration time, and tags.',
  DeleteText:
    'Permanently deletes a text sharing. This action cannot be undone. The slug will become available for reuse after deletion.',
  CreateText:
    'Creates a text snippet with a unique URL for sharing code, notes, or other text. Supports plain text, source code with syntax highlighting, and Markdown.',
  UpdateText:
    'Updates the content and/or title of an existing text sharing. The domain and slug identify which text to update.',
  GetTextHistory: 'Returns a paginated list of text sharings created by the authenticated user.',
  CheckToken: 'Checks whether an API token is valid. If valid, returns the token string and its expiration time.',
  GetUsage: 'Returns resource usage for the authenticated account.',
};
for (const item of Object.values<Obj>(paths)) {
  for (const op of Object.values<Obj>(item)) {
    const description = operationDescriptions[op.operationId];
    if (description) op.description = description;
  }
}

// `meta` is json.RawMessage in Go, which swag renders as an integer array
delete schemas['model.BioPageStyle'].properties.meta.items;
delete schemas['model.BioPageStyle'].properties.meta.type;

// swag wraps the GetTags response in httper.RespBody, nesting the envelope twice
paths['/api/v1/tags'].get.responses['200'].content['application/json'].schema = {
  $ref: '#/components/schemas/val.GetTagsRespV',
};

paths['/api/v1/file/private/download-url'].get.description += ' The URL is valid for 1 hour.';
paths['/api/v1/files'].get.description =
  'Returns a paginated list of uploaded files for the authenticated user. This API is compatible with sm.ms upload_history endpoint and returns 30 files per page sorted by creation time in descending order.';

for (const item of Object.values<Obj>(paths)) {
  for (const op of Object.values<Obj>(item)) {
    const page = op.parameters?.find((p: Obj) => p.in === 'query' && p.name === 'page');
    if (page) page.schema = { default: 1, minimum: 1, type: 'integer' };
  }
}

// Upload accepts is_private even though the swag annotation omits it
const uploadBody = paths['/api/v1/file/upload'].post.requestBody;
uploadBody.description =
  'Upload a file using multipart/form-data. The file field is required, domain, custom_slug, and is_private are optional.';
const upload = uploadBody.content['multipart/form-data'].schema;
upload.properties.file.description = "The file to be uploaded (alias 'smfile')";
upload.properties.is_private = {
  default: 0,
  description: 'Whether this file should be private (0 = public, 1 = private).',
  enum: [0, 1],
  type: 'integer',
};

// Generated pages are named after operationIds, so drop the handler prefix
for (const item of Object.values<Obj>(paths)) {
  for (const op of Object.values<Obj>(item)) {
    if (op.operationId?.startsWith('OpenAPI')) op.operationId = op.operationId.slice('OpenAPI'.length);
  }
}

// The TUS handler shares one operationId across PATCH/HEAD/DELETE; split it
const tus = paths['/api/v1/file/large-file-tus/{upload_id}'];
const tusResumable = {
  description: 'TUS protocol version',
  in: 'header',
  name: 'Tus-Resumable',
  required: true,
  schema: { enum: ['1.0.0'], type: 'string' },
};
tus.patch.operationId = 'TusUploadChunk';
tus.patch.summary = 'TUS Upload Chunk';
tus.patch.description = 'Uploads a chunk of a large file using the TUS 1.0 protocol. Use a TUS client library rather than calling this directly. The upload_id comes from the Create Large File Upload Session endpoint.';
tus.patch.parameters.push(tusResumable, {
  description: 'Byte offset of this chunk, which must match the current upload offset',
  in: 'header',
  name: 'Upload-Offset',
  required: true,
  schema: { type: 'integer' },
});
tus.patch.requestBody = {
  content: { 'application/offset+octet-stream': { schema: { format: 'binary', type: 'string' } } },
  description: 'Raw bytes of the chunk',
  required: true,
};
tus.patch.responses['204'].description = 'Chunk accepted. The new offset is returned in the Upload-Offset header.';
tus.head.operationId = 'TusGetUploadOffset';
tus.head.summary = 'TUS Get Upload Offset';
tus.head.description = 'Returns the current offset of a TUS upload in the Upload-Offset response header, so an interrupted upload can be resumed.';
tus.head.parameters.push(tusResumable);
tus.head.responses['204'].description = 'The current offset is returned in the Upload-Offset header.';
tus.delete.operationId = 'TusTerminateUpload';
tus.delete.summary = 'TUS Terminate Upload';
tus.delete.description = 'Terminates a TUS upload and discards the data received so far.';
tus.delete.parameters.push(tusResumable);
tus.delete.responses['204'].description = 'Upload terminated';

// Drop undefined values so they don't end up in the YAML
const clean = (v: unknown) => JSON.parse(JSON.stringify(v));

writeFileSync(output, dumpYaml(clean(doc), { lineWidth: -1, noRefs: true, sortKeys: true }));
console.log(`Wrote ${output}`);
