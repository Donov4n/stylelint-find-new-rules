/**
 * Stylelint rule metadata returned by stylelint-find-new-rules.
 */
export type Rule = {
    /**
     * Rule name, including the plugin namespace when present.
     */
    name: string;

    /**
     * Documentation URL when it can be resolved.
     */
    url: string | null;

    /**
     * Whether the rule is marked as deprecated.
     *
     * Absent when the configured rule cannot be matched to an available rule.
     */
    isDeprecated?: boolean;
};

/**
 * Result of comparing a resolved Stylelint config with all available rules.
 */
export type Result = {
    /**
     * All available core and plugin rules.
     */
    all: Rule[];

    /**
     * Rules configured in the resolved Stylelint config.
     */
    used: Rule[];

    /**
     * Available non-deprecated rules missing from the config.
     */
    unused: Rule[];

    /**
     * Configured rules that are not available.
     */
    invalid: Rule[];

    /**
     * Configured rules marked as deprecated.
     */
    deprecated: Rule[];
};

/**
 * Finds available, configured, unused, invalid, and deprecated Stylelint rules.
 *
 * @param configFile - Path to a Stylelint config file.
 */
declare const stylelintFindNewRules: (
    configFile?: string | null,
) => Promise<Result>;

export default stylelintFindNewRules;
