/// <reference types="react" />
import { IGenericFieldProps } from "../../frontend-engine";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "./types";
export declare const TextField: (props: IGenericFieldProps<ITextfieldSchema | IEmailSchema | INumberSchema>) => JSX.Element;
