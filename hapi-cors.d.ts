declare module 'hapi-cors' {
    import { ServerRegisterPluginObject } from '@hapi/hapi';
    const HapiCors: ServerRegisterPluginObject<unknown>;
    export default HapiCors;
}