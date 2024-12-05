import { IGenericFieldProps } from "..";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./types";
export declare const TextField: (props: IGenericFieldProps<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema>) => import("react/jsx-runtime").JSX.Element;
