import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { NavigateNext } from "@material-ui/icons";
import { IPath } from "../../interfaces/global.interface";

const useStyles = makeStyles(() => createStyles({
    breadCrumb: {
        paddingBottom: '20px'
    },
    activeBreadCrumb: {
        cursor: "pointer",
        color: "#0073bb",
        fontSize: "14px",
        lineHeight: "22px",
        "&:hover": {
            color: "#0073bb",
            textDecoration: "underline"
        }
    },
    inActiveBreadCrumb: {
        color: "#687078",
        textDecoration: "none",
        cursor: "default",
        pointerEvents: "none",
        fontSize: "14px",
        lineHeight: "22px",
    }
}))

interface IBreadCrumbs {
    paths: IPath[];
}

const CommonBreadCrumb: React.FC<IBreadCrumbs> = ({
                                                      paths,
                                            }) => {
    const classes = useStyles();

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNext fontSize="small" />}
            className={classes.breadCrumb}
        >
            {paths.map((path: IPath, index: number) => {
                const active = paths.length - 1 !== index;
                return (
                    path.to && active ?
                        (
                            <Link component={RouterLink} to={path.to} key={index}>
                                {path.title}
                            </Link>
                        )
                        :
                        (
                            <Typography
                                key={index}
                                color={active ? "primary" : 'textSecondary'}
                                onClick={() => active && path.onClick && path.onClick()}
                                className={active ? classes.activeBreadCrumb: classes.inActiveBreadCrumb}
                            >
                                {path.title}
                            </Typography>
                        )
                )
            })}
        </Breadcrumbs>
    );
};

export default CommonBreadCrumb;
