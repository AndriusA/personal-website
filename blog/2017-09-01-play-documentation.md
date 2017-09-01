---
title: "Automatically generated documentation for Play framework applications"
description: "Using built-in tools to help your documentation stay up to date"
tags: [play, hat, documentation, ]
date: 2017-09-01 20:00
categories: [hat]
published: true
---

Let the engineer who loves writing documentation throw the first stone... And for the rest of us, every little helps.

At the Hub of All Things we love the Play framework. It greatly helps us build solid, modular and maintainable services and as they outgrow themselves - modularise them into new ones with single responsibility. It also has some tools making API documentation easier.

Some of the Play framework compiler tools can be used inside a running application, e.g. the routes compiler. Play application routes are relatively simple:

```
# Public landing page
GET         /                                     controllers.Application.index
# Automatically generated service self-documentation
GET         /docs                                 controllers.Application.availableRoutes
# ...
```

To generate documentation from the routes file, you can do so in an action of its own. Play routes compiler can be included by adding it to your project's Library Dependencies:
```
"com.typesafe.play" %% "routes-compiler" % "2.5.6"
```

Then in the controller, import the right features of the compiler:
```
import play.routes.compiler.{ Parameter, Route }
```

Parse the project's routes file:
```
private lazy val routesURI = environment.classLoader.getResource("routes").toURI
private lazy val parsedRoutes = play.routes.compiler.RoutesFileParser.parse(new File(routesURI))
```

With just that, `parsedRoutes` includes a list of route information, each with:

- the HTTP method used
- the URL path
- any comments immediately preceding the route definition
- any parameters if defined

Every route is defined through a composition of simple `case classes`, the ones of interest being:

```
case class Route(verb: HttpVerb, path: PathPattern, call: HandlerCall, comments: List[Comment] = List())
case class HandlerCall(packageName: String, controller: String, instantiate: Boolean, method: String, parameters: Option[Seq[Parameter]])
case class Parameter(name: String, typeName: String, fixed: Option[String], default: Option[String])
```

It is easy to see how it can be used. We have simplified the model:

```
case class RouteDocumentationRow(method: String, path: String, explanation: Seq[String], parameters: Option[Seq[Parameter]])

private lazy val routeDocs = parsedRoutes match {
    case Left(errors) =>
      logger.error(s"Error parsing routes: $errors")
      Seq()
    case Right(rules) =>
      rules collect {
        case r: Route =>
          RouteDocumentationRow(r.verb.toString(), r.path.toString(),
            r.comments.map(_.comment).map(_.trim).filter(_.nonEmpty),
            r.call.parameters)

      }
  }
```

Feeding into a simple HTML template:
```
<ul>
    @docs.map { route =>
        <li>
            <strong>@route.method</strong>
            /@route.path
            <ul>
                @route.explanation.map { explanation =>
                    <li>@explanation</li>
                }
                @route.parameters.map { parameters =>
                    <li>Parameters:</li>
                    <ul>
                        @parameters.map { param =>
                            <li>@param.name - @param.typeName.replace("java.util.", "")
                                @param.default.map { defaultValue =>
                                Default = @defaultValue
                                }
                            </li>
                        }
                    </ul>
                }
            </ul>
        </li>
    }
</ul>
```

By no means this is a substitute for proper documentation, but then there aren't really any adequate tools and this serves our purposes nicely to always have a live, running service publish its own basic documentation.


